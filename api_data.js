define({ "api": [
  {
    "type": "get",
    "url": "arbitrators/:arbitratorAddress",
    "title": "fetch arbitrator with last block data",
    "group": "Arbitrator",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>of arbitrator contract</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"address\": '0x133b5b851cc62de33a02c928f6ac112cd42d1d83',\n  \"lastBlock\": 5235,\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Arbitrator",
    "name": "GetArbitratorsArbitratoraddress"
  },
  {
    "type": "post",
    "url": "arbitrators/:arbitratorAddress",
    "title": "Add/Update a arbitrator",
    "group": "Arbitrator",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>of arbitrator</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"address\": '0x133b5b851cc62de33a02c928f6ac112cd42d1d83',\n  \"lastBlock\": 5235,\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Arbitrator",
    "name": "PostArbitratorsArbitratoraddress"
  },
  {
    "type": "post",
    "url": "arbitrators/:arbitratorAddress/disputes/:disputeId",
    "title": "Add/Update a dispute",
    "group": "Dispute",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unique",
            "description": "<p>hash of the dispute</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Dispute",
    "name": "PostArbitratorsArbitratoraddressDisputesDisputeid"
  },
  {
    "type": "get",
    "url": ":address",
    "title": "Get profile by address",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "contracts",
            "description": "<p>Contract user</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "disputes",
            "description": "<p>Dispute user</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created_at",
            "description": "<p>Create's date document</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "List error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "GetAddress"
  },
  {
    "type": "get",
    "url": "arbitrators/:arbitratorAddress/disputes/:disputeId",
    "title": "fetch dispute by arbitrator address and disputeId",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unique",
            "description": "<p>hash of the dispute</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "GetArbitratorsArbitratoraddressDisputesDisputeid"
  },
  {
    "type": "post",
    "url": ":address",
    "title": "Add/Update a profile",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "PostAddress"
  },
  {
    "type": "post",
    "url": ":address/arbitrator/:arbitratorAddress/disputes/:disputeId",
    "title": "Add/Update a dispute",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum address of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "PostAddressArbitratorArbitratoraddressDisputesDisputeid"
  },
  {
    "type": "post",
    "url": ":address/contracts/:contractAddress",
    "title": "Add/Update a contract",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum address of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "PostAddressContractsContractaddress"
  },
  {
    "type": "post",
    "url": ":address/contracts/:contractAddress/evidence",
    "title": "Add an evidence in the contract",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum address of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "PostAddressContractsContractaddressEvidence"
  },
  {
    "type": "post",
    "url": "fake-data/:address",
    "title": "Add a fake profile",
    "group": "Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Ethereum of the juror</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"59aca9607879b17103bb1b43\",\n  \"contracts\": [],\n  \"disputes\": [],\n  \"__v\": 0,\n  \"created_at\": \"2017-09-04T01:16:16.726Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Profile",
    "name": "PostFakeDataAddress"
  }
] });
