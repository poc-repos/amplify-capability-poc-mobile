export type AmplifyDependentResourcesAttributes = {
    "analytics": {
        "amplifycapabilitypoc": {
            "Region": "string",
            "Id": "string",
            "appName": "string"
        }
    },
    "api": {
        "AmplifyCapabilityPoC": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "AmplifyCapabilityPoC": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "predictions": {
        "amplifypocinterprettext": {
            "region": "string",
            "type": "string"
        },
        "translateTextbca80352": {
            "region": "string",
            "sourceLang": "string",
            "targetLang": "string"
        }
    }
}