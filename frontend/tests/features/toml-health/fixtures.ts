export const healthyAnchorToml = `
VERSION="2.0.0"
NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
FEDERATION_SERVER="https://api.stellar.example.com/federation"
WEB_AUTH_ENDPOINT="https://api.stellar.example.com/auth"
TRANSFER_SERVER="https://api.stellar.example.com/transfer"
SIGNING_KEY="GBQP2WXPJMQJ7L6Z5LZOMQNX46F7Q5FVLWT4FDJVVWQRFBF6GBF7XNXX"

[[CURRENCIES]]
code="USD"
issuer="GBQP2WXPJMQJ7L6Z5LZOMQNX46F7Q5FVLWT4FDJVVWQRFBF6GBF7XNXX"
display_decimals=2
`.trim();

export const malformedToml = `
VERSION="2.0.0
SIGNING_KEY="INVALID_KEY"
`.trim();

export const unknownFieldsToml = `
VERSION="2.0.0"
CUSTOM_FIELD="custom_value"
UNKNOWN_SETTING="something"
`.trim();

export const duplicatedFieldToml = `
VERSION="2.0.0"
SIGNING_KEY="GBQP2WXPJMQJ7L6Z5LZOMQNX46F7Q5FVLWT4FDJVVWQRFBF6GBF7XNXX"
VERSION="2.1.0"
`.trim();
