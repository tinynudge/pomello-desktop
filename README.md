Deployment

- `APPLE_API_KEY_ID`: The key id of the generated Apple App Store Connect API token.
- `APPLE_API_ISSUER`: The issuer id for the Apple App Store Connect user.
- `APPLE_API_KEY`: The contents of the secret key that is downloaded after generating a new Apple App Store Connect API key (access: App Manager). Note that the file is only downloadable once. The file name looks like: `AuthKey_XXXXXXXXXX.p8`
- `AWS_ACCESS_KEY_ID`: The AWS acccount id that has permission to upload to the `S3_RELEASE_BUCKET`.
- `AWS_SECRET_ACCESS_KEY`: The access key for the AWS account.
- `OSX_CODE_SIGN_CERT_PASSWORD`: The password used to encode the `Certificates.p12` file.
- `OSX_CODE_SIGN_CERT`: The contents of `encoded.txt` after doing the following steps. Download both the "Developer ID Installer" and the "Developer ID Application" certificates from the Apple Developer Portal:
  1. Open Keychain Access and export _both_ certificates into a _single_ file with a strong password.
  2. Base64-encode your certificates using the following command: `base64 -i Certificates.p12 -o encoded.txt`
- `S3_RELEASE_BUCKET`: The name of the S3 bucket to upload releases to.
- `SNAPCRAFT_TOKEN`: The token generated after running: `snapcraft export-login --snaps pomello --channels edge -`.
- `VITE_AUTO_UPDATE_URL`: The URL that `electron-updater` uses to check for updates.
