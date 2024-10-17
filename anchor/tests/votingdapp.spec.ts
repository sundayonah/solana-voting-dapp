import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Votingdapp } from '../target/types/votingdapp';
import { startAnchor } from 'solana-bankrun';
import { BankrunProvider } from 'anchor-bankrun';



const IDL = require('../target/idl/votingdapp.json');

const votingDappAddress = new PublicKey('AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ');

describe('votingdapp', () => {

  let context;
  let provider: BankrunProvider;
  let votingDappProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor('', [{ name: 'votingdapp', programId: votingDappAddress }], []);
    provider = new BankrunProvider(context);

    votingDappProgram = new Program<Votingdapp>(IDL, provider);
  })

  it('Initialize Poll', async () => {
    context = await startAnchor('', [{ name: 'votingdapp', programId: votingDappAddress }], []);
    provider = new BankrunProvider(context);

    votingDappProgram = new Program<Votingdapp>(IDL, provider);

    await votingDappProgram.methods
      .initializePoll(
        new anchor.BN(1),
        'Example Poll',
        new anchor.BN(0),
        new anchor.BN(1828986482)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingDappAddress
    );

    const poll = await votingDappProgram.account.poll.fetch(pollAddress);
    // console.log('Poll: ', poll);

    // Now expect
    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual('Example Poll');
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());


  });
  it('Initialize Candidate', async () => {
    await votingDappProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1)
    ).rpc();

    await votingDappProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1)
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingDappAddress
    );


    const crunchyCandidate = await votingDappProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate, "crunchy Candidate");
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);
    // expect(crunchyCandidate.candidateName).toEqual("Crunchy");

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingDappAddress
    );

    const smoothCandidate = await votingDappProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate, "smooth Candidate");
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);

  });

  it('Cast Vote', async () => {

    await votingDappProgram.methods.vote(
      "Crunchy",
      new anchor.BN(1)
    ).rpc()

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingDappAddress
    );


    const crunchyCandidate = await votingDappProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate, "crunchy Candidate");
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(1);

  });
});


// Wrote new keypair to / home / onahsunday /.config / solana / id.json
// =======================================================================
// pubkey: AUzVVaDCH2bcNgvWV3rwirtUYqksMcrKgoTATisSX3ZF
// =======================================================================
// Save this seed phrase and your BIP39 passphrase to recover your new keypair:
// donor boss proud reward verb evil economy salon book music danger image
// =======================================================================
