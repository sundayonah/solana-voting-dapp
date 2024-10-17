// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { Keypair, PublicKey } from '@solana/web3.js';
// import { Votingdapp } from '../target/types/votingdapp';
// import { startAnchor } from 'solana-bankrun';
// import { BankrunProvider } from 'anchor-bankrun';

// // Program Id: 88iWMksUM4Z1xyhz1pabjCZuNZrkGKWf7RUob2Kvrca



// const IDL = require('../target/idl/votingdapp.json');

// const votingDappAddress = new PublicKey('GcD6bF1nA8CxeruTSrNvCVj4QzUXW2rXhBRQq6xe1BFQ');

// console.log(votingDappAddress, "voting Dapp Address")

// describe('votingdapp', () => {

//   let context;
//   let provider;
//   anchor.setProvider(anchor.AnchorProvider.env())
//   let votingDappProgram = anchor.workspace.Votingdapp as Program<Votingdapp>;

//   beforeAll(async () => {

//   })

//   it('Initialize Poll', async () => {
//     let context = await startAnchor('http://127.0.0.1:8899', [{ name: 'votingdapp', programId: votingDappAddress }], []);
//     let provider = new BankrunProvider(context);

//     console.log('Context:', context);
//     console.log('Provider:', provider);


//     votingDappProgram = new Program<Votingdapp>(IDL, provider);

//     await votingDappProgram.methods
//       .initializePoll(
//         new anchor.BN(1),
//         'Example Poll',
//         new anchor.BN(0),
//         new anchor.BN(1828986482)
//       )
//       .rpc();

//     const [pollAddress] = PublicKey.findProgramAddressSync(
//       [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
//       votingDappAddress
//     );

//     const poll = await votingDappProgram.account.poll.fetch(pollAddress);
//     // console.log('Poll: ', poll);

//     // Now expect
//     expect(poll.pollId.toNumber()).toEqual(1);
//     expect(poll.description).toEqual('Example Poll');
//     expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());


//   });
//   it('Initialize Candidate', async () => {
//     await votingDappProgram.methods.initializeCandidate(
//       "Smooth",
//       new anchor.BN(1)
//     ).rpc();

//     await votingDappProgram.methods.initializeCandidate(
//       "Crunchy",
//       new anchor.BN(1)
//     ).rpc();

//     const [crunchyAddress] = PublicKey.findProgramAddressSync(
//       [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
//       votingDappAddress
//     );


//     const crunchyCandidate = await votingDappProgram.account.candidate.fetch(crunchyAddress);
//     console.log(crunchyCandidate, "crunchy Candidate");
//     expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);
//     // expect(crunchyCandidate.candidateName).toEqual("Crunchy");

//     const [smoothAddress] = PublicKey.findProgramAddressSync(
//       [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
//       votingDappAddress
//     );

//     const smoothCandidate = await votingDappProgram.account.candidate.fetch(smoothAddress);
//     console.log(smoothCandidate, "smooth Candidate");
//     expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);

//   });

//   it('Cast Vote', async () => {

//     await votingDappProgram.methods.vote(
//       "Crunchy",
//       new anchor.BN(1)
//     ).rpc()

//     const [crunchyAddress] = PublicKey.findProgramAddressSync(
//       [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
//       votingDappAddress
//     );


//     const crunchyCandidate = await votingDappProgram.account.candidate.fetch(crunchyAddress);
//     console.log(crunchyCandidate, "crunchy Candidate");
//     expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(1);

//   });
// });


// // Wrote new keypair to / home / onahsunday /.config / solana / id.json
// // =======================================================================
// // pubkey: AUzVVaDCH2bcNgvWV3rwirtUYqksMcrKgoTATisSX3ZF
// // =======================================================================
// // Save this seed phrase and your BIP39 passphrase to recover your new keypair:
// // donor boss proud reward verb evil economy salon book music danger image
// // =======================================================================


import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Votingdapp } from '../target/types/votingdapp';import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";

const IDL = require('../target/idl/votingdapp.json');

const votingDappAddress = new PublicKey('GcD6bF1nA8CxeruTSrNvCVj4QzUXW2rXhBRQq6xe1BFQ');

describe('Votingdapp', () => {

  let context;
  let provider;
  // let votingDappProgram;
  //anchor.setProvider(anchor.AnchorProvider.env());
  let votingDappProgram = anchor.workspace.Votingdapp as Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "voting", programId: votingDappAddress}], []);
    provider = new BankrunProvider(context);

     votingDappProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {
    await votingDappProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite type of peanut butter?",
      new anchor.BN(0),
      new anchor.BN(1821246480),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingDappAddress,
    )

    const poll = await votingDappProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("initialize candidate", async() => {
    await votingDappProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await votingDappProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingDappAddress,
    );
    const crunchyCandidate = await votingDappProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate);
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingDappAddress,
    );
    const smoothCandidate = await votingDappProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);
  });

  it("vote", async() => {
    await votingDappProgram.methods
      .vote(
        "Smooth",
        new anchor.BN(1)
      ).rpc()

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingDappAddress,
    );
    const smoothCandidate = await votingDappProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);
  });

});