const partyA = '0xAcB2db3E3fA7a6cba5dFE964408099d860246D7Z'
const partyB = '0xBcB2db3E3fA7a6cba5dFE964408099d860246D7Z'
const contract1Address = '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z'
const contract2Address = '0xEcB2db3E3fA7a6cba5dFE964408099d860246D7Z'

module.exports = jurorAddress => {
  return (
    // juror account
    [
      {
        address: jurorAddress,
        balance: 0,
        contracts: [],
        disputes: [
          {
            hash : 'f88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA: partyA,
            partyB: partyB,
            title: 'Unknown Website Owner',
            deadline: '01/01/2017',
            status: 'vote',
            contractAddress: contract1Address,
            justification: 'justification',
            fee: 40000000000,
            disputeId: 1,
            votes: [1,3],
            hasRuled: false,
            resolutionOptions: [
              {
                name: 'Reimburse Party A',
                description: 'Release funds to Party A',
                value: 1
              },
              {
                name: 'Pay Party B',
                description: 'Release funds to Party B',
                value: 2
              }
            ]
          },
          {
            hash : 'as8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA: partyA,
            partyB: partyB,
            title: 'Uncomplete Software Project',
            deadline: '01/02/2017',
            status: 'opportunity to appeal',
            contractAddress: contract2Address,
            justification: 'justification',
            fee: 25000000000,
            resolutionOptions: [
              {
                name: 'Reimburse Party A',
                description: 'Release funds to Party A',
                value: 1
              },
              {
                name: 'Pay Party B',
                description: 'Release funds to Party B',
                value: 2
              }
            ]
          },
        ]
      },
      // partyA
      {
        address: partyA,
        contracts: [
          {
            address: contract1Address,
            hash : 'l88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA : partyA,
            partyB : partyB,
            email: 'open@bazar.fr',
            name: 'name',
            description: 'description',
            evidencePartyA: [
              {
                hash: 'b88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party B is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'w88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ],
            evidencePartyB: [
              {
                hash: 'fx8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party A is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'a88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ]
          },
          {
            address: contract2Address,
            hash : 'l98df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA : partyA,
            partyB : partyB,
            email: 'open@bazar.fr',
            name: 'different name',
            description: 'different description',
            evidencePartyA: [
              {
                hash: 'b88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party B is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'w88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ],
            evidencePartyB: [
              {
                hash: 'fx8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party A is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'a88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ]
          }
        ]
      },
      // partyB
      {
        address: partyB,
        contracts: [
          {
            address: contract1Address,
            hash : 'l88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA : partyA,
            partyB : partyB,
            email: 'open@bazar.fr',
            name: 'name',
            description: 'description',
            evidencePartyA: [
              {
                hash: 'b88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party B is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'w88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ],
            evidencePartyB: [
              {
                hash: 'fx8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party A is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'a88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ]
          },
          {
            address: contract2Address,
            hash : 'l98df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            partyA : partyA,
            partyB : partyB,
            email: 'open@bazar.fr',
            name: 'different name',
            description: 'different description',
            evidencePartyA: [
              {
                hash: 'b88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party B is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'w88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ],
            evidencePartyB: [
              {
                hash: 'fx8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Accusation',
                description: 'Party A is wrong',
                documentContent: 'myEvidence'
              },
              {
                hash: 'a88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
                title: 'Defense',
                description: 'I am right',
                documentContent: 'myEvidence'
              }
            ]
          }
        ]
      }
    ]
  )
}
