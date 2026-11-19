<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.APPLE
TAG: LEEWAY.UNIVERSAL_EXTENSION.SAFARI_ADOPTION.V1
5WH:
WHAT: Specify how the LeeWay WebExtension becomes an embedded Safari extension.
WHY: Prevent treating an iLoader-installed Device Bridge app as a browser extension it does not contain.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: apple/README.md.
WHEN: 2026-11-19.
HOW: Add this target and the shared extension assets to the canonical Device Bridge Apple Xcode project.
LICENSE: Existing repository terms apply.
-->
# Safari adoption boundary

This folder is source for the Safari app-extension target. It is **not yet embedded** in the canonical `LeeWayDeviceBridgeApple` Xcode project and is not an installable IPA by itself.

The Apple build owner must add a `Safari Web Extension` target, use bundle identity `industries.leeway.devicebridge.safari-extension`, copy the exact `extension/` assets into its WebExtension resource bundle, sign both the containing iPhone app and extension with the same approved Apple team, and run the iPhone enablement test in Settings → Safari → Extensions.

iLoader may then sign/install the combined IPA. Until that Xcode integration, Apple signing, iPhone enablement, and native-host handshake are completed, this is `SOURCE_IMPLEMENTED`, not `INSTALLED` or `QUALIFIED`.
