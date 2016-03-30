define({ "api": [
  {
    "type": "get",
    "url": "/v1/auth/login",
    "title": "sign in and/or log in",
    "name": "Login",
    "version": "0.0.1",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "code",
            "description": "<p>Represents the authorization code to access the registered application on github.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "api_key",
            "description": "<p>Represents the key to the application registered on the server.</p>"
          }
        ]
      }
    },
    "description": "<p>Register the user and returns the authorization to use the api.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"56b8c4c4288ff76e0f8225d3\",\n  \"_usr_id\": \"object usr\",\n  \"_app_id\": \"object app\",\n  \"axs_key\": \"56b8c4c4288ff76e0f8225d1\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/v1/auth/logout",
    "title": "logout",
    "name": "Logout",
    "version": "0.0.1",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "api_key",
            "description": "<p>Represents the key to the application registered on the server.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "axs_key",
            "description": "<p>Represents the access key to use the api.</p>"
          }
        ]
      }
    },
    "description": "<p>Removes the token.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isLogout",
            "description": "<p>It indicates that the token has been removed.</p>"
          }
        ]
      }
    },
    "filename": "routes/v1/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/v1/net/waves",
    "title": "create a wave",
    "name": "CreateWave",
    "version": "0.0.1",
    "group": "Net",
    "description": "<p>Inserts a wave (state of the network) into the database.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>An array of javascript objects that represents the state of the network at the moment of the arrays creation</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>It represents a node or body[{Number} index].</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "object.hash",
            "description": "<p>It represents the id or hash of the node.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "object.type",
            "description": "<p>It represents the node type (server, client, service, etc)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object.extra",
            "description": "<p>Has any extra information that wants to be showed</p>"
          },
          {
            "group": "Parameter",
            "type": "ISODate",
            "optional": false,
            "field": "object.upd_at",
            "description": "<p>Last update</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "object.chldrn",
            "description": "<p>An array of the nodes hashes that are connected to this node</p>"
          }
        ]
      }
    },
    "filename": "routes/v1/net/index.js",
    "groupTitle": "Net"
  },
  {
    "type": "get",
    "url": "/v1/net/nodes/:hash/childrn",
    "title": "get children",
    "name": "GetChildren",
    "version": "0.0.1",
    "group": "Net",
    "description": "<p>Lists all devices connected to a P2P network node given its hash.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Hash",
            "optional": false,
            "field": "hash",
            "description": "<p>It represents the hash node.</p>"
          }
        ]
      }
    },
    "filename": "routes/v1/net/index.js",
    "groupTitle": "Net"
  },
  {
    "type": "get",
    "url": "/v1/net/servrs",
    "title": "get server network",
    "name": "GetServerNetwork",
    "version": "0.0.1",
    "group": "Net",
    "description": "<p>List servers connected to the P2P network fermat.</p>",
    "filename": "routes/v1/net/index.js",
    "groupTitle": "Net"
  },
  {
    "type": "get",
    "url": "/v1/repo/manifest/check",
    "title": "check manifest",
    "name": "CheckManifest",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>checks if the manifest has a correct format.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/book",
    "title": "get book",
    "name": "GetBook",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Get the contents of the book of fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/comps",
    "title": "get components",
    "name": "GetComps",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>List of layers, super layer, platforms, components and processes from architecture of fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/devs",
    "title": "get developers",
    "name": "GetDevs",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Get information from the developers involved in the repository fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/docs/:type",
    "title": "get docs",
    "name": "GetDocs",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Get the contents of the documentation of fermat.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Represents the type of documentation (book, readme, paper).</p>"
          }
        ]
      }
    },
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/procs",
    "title": "get process",
    "name": "GetProcs",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Get list processes from architecture of fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/readme",
    "title": "get readme",
    "name": "GetReadme",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Get the contents of the readme of fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "get",
    "url": "/v1/repo/comps/reload",
    "title": "reload",
    "name": "Reload",
    "version": "0.0.1",
    "group": "REPO",
    "description": "<p>Updates the database repository components fermat.</p>",
    "filename": "routes/v1/repo/index.js",
    "groupTitle": "REPO"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/comps",
    "title": "add components",
    "version": "0.0.1",
    "name": "AddComp",
    "group": "Repo_Comp",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "type",
            "optional": false,
            "field": "layer_id",
            "description": "<p>Unique identifier of the layer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Component name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Component type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "difficulty",
            "description": "<p>Component complexity developed  rank (0- 10).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code_level",
            "description": "<p>Developing state api.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "platfrm_id",
            "description": "<p>Unique identifier of the  platfrtm.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "suprlay_id",
            "description": "<p>Unique identifier of the  suprlay.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of  components.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "repo_dir",
            "description": "<p>Directory of repo.</p>"
          }
        ]
      }
    },
    "description": "<p>Add a component to the architecture fermat.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs",
    "title": "add component developer",
    "version": "0.0.1",
    "name": "AddCompDev",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "dev_id",
            "description": "<p>Unique identifier of the developer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Developer role.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "scope",
            "description": "<p>Range in plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "percnt",
            "description": "<p>Percentage that has developed. .</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "description": "<p>Add component to developer.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id",
    "title": "delete component",
    "version": "0.0.1",
    "name": "DelComp",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs/:comp_dev_id",
    "title": "delete component developer",
    "version": "0.0.1",
    "name": "DelCompDev",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "dev_id",
            "description": "<p>Unique identifier of the developer.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "description": "<p>Delete component to developer.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id",
    "title": "get component",
    "version": "0.0.1",
    "name": "GetComp",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/comps",
    "title": "list comps",
    "version": "0.0.1",
    "name": "ListComps",
    "group": "Repo_Comp",
    "description": "<p>Get a list of components of the architecture fermat.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id",
    "title": "update component",
    "version": "0.0.1",
    "name": "UptComp",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "layer_id",
            "description": "<p>Unique identifier of the layer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Component name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Component type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "difficulty",
            "description": "<p>Component complexity developed  rank (0- 10).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code_level",
            "description": "<p>Developing state api.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of  components.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "repo_dir",
            "description": "<p>Directory of repo.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs/:comp_dev_id",
    "title": "update component developer",
    "version": "0.0.1",
    "name": "UptCompDev",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "dev_id",
            "description": "<p>Unique identifier of the developer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Developer role.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "scope",
            "description": "<p>Range in plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "percnt",
            "description": "<p>Percentage that has developed.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "description": "<p>Update component to developer.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/comps/:comp_id/life-cicles/:life_cicle_id",
    "title": "update lifecicles to component",
    "version": "0.0.1",
    "name": "UptLifeCiclesToComp",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "life_cicle_id",
            "description": "<p>Unique identifier of the  life cicle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "target",
            "description": "<p>Estimated completion date.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "reached",
            "description": "<p>True date of completion.</p>"
          }
        ]
      }
    },
    "group": "Repo_Comp",
    "description": "<p>updates the lifecycle of a component of the architecture fermat.</p>",
    "filename": "routes/v1/repo/comp/index.js",
    "groupTitle": "Repo_Comp"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/layers",
    "title": "add layer",
    "version": "0.0.1",
    "name": "AddLayer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Layer name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>{java, javascript, c++, c#, etc}.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suprlay",
            "description": "<p>superlayer code (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the layer this with respect to other.</p>"
          }
        ]
      }
    },
    "group": "Repo_Layer",
    "description": "<p>Add a layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/layer/index.js",
    "groupTitle": "Repo_Layer"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/layers/:layer_id",
    "title": "delete layer",
    "version": "0.0.1",
    "name": "DelLay",
    "group": "Repo_Layer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "layer_id",
            "description": "<p>Represents the identifier of the layer</p>"
          }
        ]
      }
    },
    "description": "<p>Delete layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/layer/index.js",
    "groupTitle": "Repo_Layer"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/layers/:layer_id",
    "title": "get layer",
    "version": "0.0.1",
    "name": "GetLay",
    "group": "Repo_Layer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "layer_id",
            "description": "<p>Unique identifier of the layer.</p>"
          }
        ]
      }
    },
    "description": "<p>Get a layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/layer/index.js",
    "groupTitle": "Repo_Layer"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/layers",
    "title": "get list layers",
    "version": "0.0.1",
    "name": "ListLayers",
    "group": "Repo_Layer",
    "description": "<p>get a list of layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/layer/index.js",
    "groupTitle": "Repo_Layer"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/layers/:layer_id",
    "title": "update layer",
    "version": "0.0.1",
    "name": "UptLay",
    "group": "Repo_Layer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "layer_id",
            "description": "<p>Represents the identifier of the layer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Layer name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>xxxxx.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suprlay",
            "description": "<p>xxxxx.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the layer this with respect to other.</p>"
          }
        ]
      }
    },
    "description": "<p>Update layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/layer/index.js",
    "groupTitle": "Repo_Layer"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/platfrms",
    "title": "add platform",
    "version": "0.0.1",
    "name": "AddPlatform",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>xxxxx.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Platform name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logo",
            "description": "<p>Platform logo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the platform this with respect to other.</p>"
          }
        ]
      }
    },
    "group": "Repo_Platform",
    "description": "<p>Add a platform to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/platfrm/index.js",
    "groupTitle": "Repo_Platform"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/platfrms/:platfrm_id",
    "title": "delete platform",
    "version": "0.0.1",
    "name": "DelPltf",
    "group": "Repo_Platform",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "platfrm_id",
            "description": "<p>Represents the identifier of the platform.</p>"
          }
        ]
      }
    },
    "description": "<p>Delete platform from the architecture of fermat.</p>",
    "filename": "routes/v1/repo/platfrm/index.js",
    "groupTitle": "Repo_Platform"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/platfrms/:platfrm_id",
    "title": "get platform",
    "version": "0.0.1",
    "name": "GetPlatform",
    "group": "Repo_Platform",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "platfrm_id",
            "description": "<p>Represents the identifier of the platform.</p>"
          }
        ]
      }
    },
    "description": "<p>Get platform from the architecture of fermat.</p>",
    "filename": "routes/v1/repo/platfrm/index.js",
    "groupTitle": "Repo_Platform"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/platfrms",
    "title": "list platforms",
    "version": "0.0.1",
    "name": "ListPlatforms",
    "group": "Repo_Platform",
    "description": "<p>Get list platforms from the architecture of fermat.</p>",
    "filename": "routes/v1/repo/platfrm/index.js",
    "groupTitle": "Repo_Platform"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/platfrms/:platfrm_id",
    "title": "update platform",
    "version": "0.0.1",
    "name": "UptPltf",
    "group": "Repo_Platform",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "platfrm_id",
            "description": "<p>Represents the identifier of the platform.</p>"
          }
        ]
      }
    },
    "description": "<p>Update platform from the architecture of fermat.</p>",
    "filename": "routes/v1/repo/platfrm/index.js",
    "groupTitle": "Repo_Platform"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/procs",
    "title": "add process",
    "version": "0.0.1",
    "name": "AddProc",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "platfrm",
            "description": "<p>Platform data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Process name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Process description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prev",
            "description": "<p>Id of the previous process.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "next",
            "description": "<p>Id the next process.</p>"
          }
        ]
      }
    },
    "description": "<p>Add a process to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id/steps",
    "title": "add step",
    "version": "0.0.1",
    "name": "AddStep",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Step type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Step title.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Step description.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the step this with respect to other.</p>"
          }
        ]
      }
    },
    "description": "<p>Adds a step to the process.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id",
    "title": "delete process",
    "version": "0.0.1",
    "name": "DelProc",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          }
        ]
      }
    },
    "description": "<p>Update process architecture fermat.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id/steps/:step_id",
    "title": "delete step",
    "version": "0.0.1",
    "name": "DelStep",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "step_id",
            "description": "<p>Unique identifier of the step.</p>"
          }
        ]
      }
    },
    "description": "<p>Delete a step of a process.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id",
    "title": "get process",
    "version": "0.0.1",
    "name": "GetProc",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          }
        ]
      }
    },
    "description": "<p>Get process architecture fermat.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/procs",
    "title": "lists process",
    "version": "0.0.1",
    "name": "ListProcs",
    "group": "Repo_Proc",
    "description": "<p>Get lists of process to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id",
    "title": "update process",
    "version": "0.0.1",
    "name": "UptProc",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "platfrm",
            "description": "<p>Platform data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Process name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Process description.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prev",
            "description": "<p>Id of the previous process.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "next",
            "description": "<p>Id the next process.</p>"
          }
        ]
      }
    },
    "description": "<p>Update process architecture fermat.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/procs/:proc_id/steps/:step_id",
    "title": "update step",
    "version": "0.0.1",
    "name": "UptStep",
    "group": "Repo_Proc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "proc_id",
            "description": "<p>Unique identifier of the process.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "step_id",
            "description": "<p>Unique identifier of the step.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "comp_id",
            "description": "<p>Unique identifier of the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Step type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Step title.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Step description.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the step this with respect to other.</p>"
          }
        ]
      }
    },
    "description": "<p>Updates a step of a process.</p>",
    "filename": "routes/v1/repo/proc/index.js",
    "groupTitle": "Repo_Proc"
  },
  {
    "type": "post",
    "url": "/v1/repo/usrs/:usr_id/suprlays",
    "title": "add super layer",
    "version": "0.0.1",
    "name": "AddSuprLay",
    "group": "Repo_SuprLay",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Superlay code.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Superlay name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logo",
            "description": "<p>Superlay logo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the suprlay this with respect to other.</p>"
          }
        ]
      }
    },
    "description": "<p>Add a super layer to the architecture of fermat.</p>",
    "filename": "routes/v1/repo/suprlay/index.js",
    "groupTitle": "Repo_SuprLay"
  },
  {
    "type": "delete",
    "url": "/v1/repo/usrs/:usr_id/suprlays/:suprlay_id",
    "title": "delete super layer",
    "version": "0.0.1",
    "name": "DelSprlay",
    "group": "Repo_SuprLay",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "suprlay_id",
            "description": "<p>Unique identifier of the suprlay.</p>"
          }
        ]
      }
    },
    "description": "<p>Delete super layer from architecture of fermat.</p>",
    "filename": "routes/v1/repo/suprlay/index.js",
    "groupTitle": "Repo_SuprLay"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/suprlays/:suprlay_id",
    "title": "get super layer",
    "version": "0.0.1",
    "name": "GetSprlay",
    "group": "Repo_SuprLay",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "suprlay_id",
            "description": "<p>Unique identifier of the suprlay.</p>"
          }
        ]
      }
    },
    "description": "<p>Get superlayer from architecture of fermat.</p>",
    "filename": "routes/v1/repo/suprlay/index.js",
    "groupTitle": "Repo_SuprLay"
  },
  {
    "type": "get",
    "url": "/v1/repo/usrs/:usr_id/suprlays",
    "title": "list super layers",
    "version": "0.0.1",
    "name": "ListSuprLays",
    "group": "Repo_SuprLay",
    "description": "<p>Get list super layer from architecture of fermat.</p>",
    "filename": "routes/v1/repo/suprlay/index.js",
    "groupTitle": "Repo_SuprLay"
  },
  {
    "type": "put",
    "url": "/v1/repo/usrs/:usr_id/suprlays/:suprlay_id",
    "title": "update super layer",
    "version": "0.0.1",
    "name": "UptSprlay",
    "group": "Repo_SuprLay",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "suprlay_id",
            "description": "<p>Unique identifier of the suprlay.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Superlay code.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Superlay name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logo",
            "description": "<p>Superlay logo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>Indicates the position where the suprlay this with respect to other.</p>"
          }
        ]
      }
    },
    "description": "<p>Update super layer from architecture of fermat.</p>",
    "filename": "routes/v1/repo/suprlay/index.js",
    "groupTitle": "Repo_SuprLay"
  }
] });
