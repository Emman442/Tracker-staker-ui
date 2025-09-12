/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/seeker_program.json`.
 */
export type SeekerProgram = {
    "address": "Cd6YWBPWpFTv6TCNHvLTUrLhESmT3JrfpFbcgNY4HNdw",
    "metadata": {
        "name": "seekerProgram",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "claimRewards",
            "discriminator": [
                4,
                144,
                132,
                71,
                116,
                23,
                151,
                80
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "userStake",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    117,
                                    115,
                                    101,
                                    114,
                                    95,
                                    115,
                                    116,
                                    97,
                                    107,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "user"
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userRewardAccount",
                    "writable": true
                },
                {
                    "name": "rewardVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    114,
                                    101,
                                    119,
                                    97,
                                    114,
                                    100,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "globalState",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "platformFeeVault",
                    "writable": true
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": []
        },
        {
            "name": "createStakingPool",
            "discriminator": [
                104,
                58,
                70,
                37,
                225,
                212,
                145,
                93
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    116,
                                    97,
                                    107,
                                    105,
                                    110,
                                    103,
                                    95,
                                    112,
                                    111,
                                    111,
                                    108
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "creator"
                            },
                            {
                                "kind": "account",
                                "path": "stakeTokenMint"
                            }
                        ]
                    }
                },
                {
                    "name": "creator",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "stakeTokenMint"
                },
                {
                    "name": "rewardTokenMint"
                },
                {
                    "name": "globalState",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "stakeVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    116,
                                    97,
                                    107,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "rewardVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    114,
                                    101,
                                    119,
                                    97,
                                    114,
                                    100,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "rewardRatePerTokenPerSecond",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "fundRewardPool",
            "discriminator": [
                85,
                49,
                108,
                245,
                204,
                70,
                243,
                3
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "funder",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "funderRewardAccount",
                    "writable": true
                },
                {
                    "name": "rewardVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    114,
                                    101,
                                    119,
                                    97,
                                    114,
                                    100,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initializeGlobalState",
            "discriminator": [
                232,
                254,
                209,
                244,
                123,
                89,
                154,
                207
            ],
            "accounts": [
                {
                    "name": "globalState",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "platformFeeVault"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "platformFeeBps",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "stake",
            "discriminator": [
                206,
                176,
                202,
                18,
                200,
                209,
                179,
                108
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "userStake",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    117,
                                    115,
                                    101,
                                    114,
                                    95,
                                    115,
                                    116,
                                    97,
                                    107,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "user"
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userStakeAccount",
                    "writable": true
                },
                {
                    "name": "stakeVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    116,
                                    97,
                                    107,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "lockupDuration",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "unstake",
            "discriminator": [
                90,
                95,
                107,
                42,
                205,
                124,
                50,
                225
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "userStake",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    117,
                                    115,
                                    101,
                                    114,
                                    95,
                                    115,
                                    116,
                                    97,
                                    107,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "user"
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "globalState",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "userStakeAccount",
                    "writable": true
                },
                {
                    "name": "stakeVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    116,
                                    97,
                                    107,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "updateStakingPool",
            "discriminator": [
                49,
                122,
                53,
                40,
                235,
                159,
                240,
                59
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "rewardRatePerTokenPerSecond",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdrawRewardsFromPool",
            "discriminator": [
                16,
                204,
                232,
                44,
                170,
                44,
                254,
                57
            ],
            "accounts": [
                {
                    "name": "stakingPool",
                    "writable": true
                },
                {
                    "name": "admin",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "rewardVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    114,
                                    101,
                                    119,
                                    97,
                                    114,
                                    100,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "stakingPool"
                            }
                        ]
                    }
                },
                {
                    "name": "globalState",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "creatorRewardAccount",
                    "writable": true
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "globalState",
            "discriminator": [
                163,
                46,
                74,
                168,
                216,
                123,
                133,
                98
            ]
        },
        {
            "name": "stakingPool",
            "discriminator": [
                203,
                19,
                214,
                220,
                220,
                154,
                24,
                102
            ]
        },
        {
            "name": "userStake",
            "discriminator": [
                102,
                53,
                163,
                107,
                9,
                138,
                87,
                153
            ]
        }
    ],
    "events": [
        {
            "name": "poolCreated",
            "discriminator": [
                202,
                44,
                41,
                88,
                104,
                220,
                157,
                82
            ]
        },
        {
            "name": "poolFunded",
            "discriminator": [
                164,
                221,
                242,
                68,
                164,
                64,
                24,
                214
            ]
        },
        {
            "name": "poolPaused",
            "discriminator": [
                228,
                218,
                62,
                53,
                29,
                211,
                159,
                236
            ]
        },
        {
            "name": "poolUpdated",
            "discriminator": [
                218,
                43,
                210,
                231,
                127,
                214,
                72,
                245
            ]
        },
        {
            "name": "remainingClaimed",
            "discriminator": [
                71,
                167,
                253,
                120,
                242,
                32,
                5,
                151
            ]
        },
        {
            "name": "rewardRateUpdated",
            "discriminator": [
                176,
                128,
                176,
                106,
                40,
                165,
                210,
                144
            ]
        },
        {
            "name": "rewardsClaimed",
            "discriminator": [
                75,
                98,
                88,
                18,
                219,
                112,
                88,
                121
            ]
        },
        {
            "name": "tokensStaked",
            "discriminator": [
                220,
                130,
                145,
                142,
                109,
                123,
                38,
                100
            ]
        },
        {
            "name": "tokensUnstaked",
            "discriminator": [
                137,
                203,
                131,
                80,
                135,
                107,
                181,
                150
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "invalidRewardRate",
            "msg": "Invalid reward rate"
        },
        {
            "code": 6001,
            "name": "poolInactive",
            "msg": "Pool is not active"
        },
        {
            "code": 6002,
            "name": "noStakeFound",
            "msg": "No stake found for user"
        },
        {
            "code": 6003,
            "name": "insufficientStake",
            "msg": "Insufficient staked amount"
        },
        {
            "code": 6004,
            "name": "noRewardsToClaim",
            "msg": "No rewards to claim"
        },
        {
            "code": 6005,
            "name": "unauthorized",
            "msg": "Unauthorized action"
        },
        {
            "code": 6006,
            "name": "invalidPenalty",
            "msg": "Invalid penalty percentage"
        },
        {
            "code": 6007,
            "name": "stakeLocked",
            "msg": "Stake Locked"
        }
    ],
    "types": [
        {
            "name": "globalState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "admin",
                        "type": "pubkey"
                    },
                    {
                        "name": "platformFeeBps",
                        "type": "u64"
                    },
                    {
                        "name": "platformFeeVault",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "poolCreated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "creator",
                        "type": "pubkey"
                    },
                    {
                        "name": "stakeToken",
                        "type": "pubkey"
                    },
                    {
                        "name": "rewardToken",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "poolFunded",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "funder",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "poolPaused",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "creator",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "poolUpdated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "rewardRate",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "remainingClaimed",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "rewardRateUpdated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "oldRate",
                        "type": "u64"
                    },
                    {
                        "name": "newRate",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "rewardsClaimed",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "platformFee",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "stakingPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "rewardVault",
                        "type": "pubkey"
                    },
                    {
                        "name": "stakeTokenMint",
                        "type": "pubkey"
                    },
                    {
                        "name": "totalStaked",
                        "type": "u64"
                    },
                    {
                        "name": "totalStakers",
                        "type": "u64"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "rewardRatePerTokenPerSecond",
                        "type": "u64"
                    },
                    {
                        "name": "decimals",
                        "type": "u8"
                    },
                    {
                        "name": "stakeVault",
                        "type": "pubkey"
                    },
                    {
                        "name": "rewardPerTokenStored",
                        "type": "u128"
                    },
                    {
                        "name": "lastUpdateTime",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "tokensStaked",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "totalStaked",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "tokensUnstaked",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pool",
                        "type": "pubkey"
                    },
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "penalty",
                        "type": "u64"
                    },
                    {
                        "name": "returned",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "userStake",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "pendingRewards",
                        "type": "u128"
                    },
                    {
                        "name": "totalClaimed",
                        "type": "u64"
                    },
                    {
                        "name": "startTime",
                        "type": "i64"
                    },
                    {
                        "name": "lastUpdateTime",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "lockupDuration",
                        "type": "i64"
                    },
                    {
                        "name": "userRewardPerTokenPaid",
                        "type": "u128"
                    }
                ]
            }
        }
    ],
    "constants": [
        {
            "name": "seed",
            "type": "string",
            "value": "\"anchor\""
        }
    ]
};
