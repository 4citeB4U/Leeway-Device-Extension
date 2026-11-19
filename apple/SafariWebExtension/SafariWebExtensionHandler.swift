/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.APPLE
TAG: LEEWAY.UNIVERSAL_EXTENSION.SAFARI_HANDLER.V1
5WH:
WHAT: Provide the Apple app-extension entrypoint for the same LeeWay WebExtension source.
WHY: Safari requires an embedded, signed Apple app extension rather than a Chromium ZIP.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: apple/SafariWebExtension/SafariWebExtensionHandler.swift.
WHEN: 2026-11-19.
HOW: Delegate WebExtension requests to SafariServices; no local Device Bridge execution is granted here.
LICENSE: Existing repository terms apply.
*/
import SafariServices

final class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        context.completeRequest(returningItems: nil, completionHandler: nil)
    }
}
