
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Votingdapp } from "@/../anchor/target/types/votingdapp"
import * as anchor from '@coral-xyz/anchor';
import { Program } from "@coral-xyz/anchor";
import { BN } from "bn.js";


export const OPTIONS = GET

const IDL = require("@/../anchor/target/idl/votingdapp.json")

export async function GET(request: Request) {

    const actionMetadata: ActionGetResponse = {
        icon: "https://www.nuflowerfoods.com/blogs/wp-content/uploads/2023/09/globe.jpg",
        title: "Vote for your favorite peanut butter!",
        description: "Vote between crunchy and smooth peanut butter.",
        label: "Vote",
        links: {
            actions: [
                {
                    label: "Vote Crunchy", href: "/api/vote?candidate=Crunchy",
                    type: "transaction"
                },
                {
                    label: "Vote Smooth", href: "/api/vote?candidate=Smooth",
                    type: "transaction"
                },
                {
                    label: "Vote Smooth", href: "/api/vote?candidate=Smooth",
                    type: "transaction"
                },
            ]
        },
    };

    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS })
}

export async function POST(request: Request) {
    const url = new URL(request.url)
    const candidate = url.searchParams.get("candidate");
    if (candidate != "Crunchy" && candidate != "Smooth") {
        return new Response("Invalid request", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const program: Program<Votingdapp> = new Program(IDL, { connection })

    try {
        const body = await request.json();
        let voter;

        if ('account' in body) {
            voter = new PublicKey(body.account);
        } else if ('value' in body) {
            // If account is not present, try accessing it via value
            voter = body.value?.account;
        } else {
            throw new Error('Unexpected response format');
        }

        // Use the voter variable here
        console.log(voter);

        // Rest of your logic...
        const instruction = await program.methods.vote(candidate, new BN(1)).accounts({
            signer: voter
        }).instruction()

        // get blockhash
        const blockhash = await connection.getLatestBlockhash();

        // send transaction
        const tx = new Transaction({
            feePayer: voter,
            blockhash: blockhash.blockhash,
            lastValidBlockHeight: blockhash.lastValidBlockHeight
        }).add(instruction)

        const response = await createPostResponse({
            fields: {
                type: "transaction",
                transaction: tx
            }
        })


        return Response.json(response, { headers: ACTIONS_CORS_HEADERS });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response('Internal Server Error', { status: 500, headers: ACTIONS_CORS_HEADERS });
    }
}


// Wrote new keypair to /home/onah/.config/solana/id.json
// ==========================================================================
// pubkey: GcD6bF1nA8CxeruTSrNvCVj4QzUXW2rXhBRQq6xe1BFQ
// ==========================================================================
// Save this seed phrase and your BIP39 passphrase to recover your new keypair:
// coast steel vintage copy regular farm one alley return primary again under
// ==========================================================================
