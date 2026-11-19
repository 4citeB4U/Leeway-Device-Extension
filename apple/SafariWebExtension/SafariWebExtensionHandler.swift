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
import Foundation
import SafariServices

final class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    private let appGroup = "group.industries.leeway.devicebridge"
    private let sessionKey = "leeway.safari.ownerSession.v1"
    private let allowedCapability = "page.excerpt.submit"

    func beginRequest(with context: NSExtensionContext) {
        guard let item = context.inputItems.first as? NSExtensionItem,
              let message = item.userInfo?[SFExtensionMessageKey] as? [String: Any] else {
            respond(context, ["type": "leeway.extension.error", "code": "NATIVE_MESSAGE_INVALID"])
            return
        }

        switch message["type"] as? String {
        case "leeway.extension.hello":
            respond(context, helloResponse(message))
        case "leeway.extension.page-excerpt":
            respond(context, excerptResponse(message))
        default:
            respond(context, ["type": "leeway.extension.error", "code": "NATIVE_MESSAGE_TYPE_REJECTED"])
        }
    }

    private func helloResponse(_ message: [String: Any]) -> [String: Any] {
        let helloId = message["helloId"] as? String ?? ""
        guard message["version"] as? Int == 3,
              helloId.range(of: "^[A-Za-z0-9._:-]{8,128}$", options: .regularExpression) != nil,
              let capabilities = message["requestedCapabilities"] as? [String],
              capabilities == [allowedCapability],
              let session = qualifiedSession() else {
            return [
                "type": "leeway.extension.hello-ack", "version": 3, "helloId": helloId,
                "authenticated": false, "capabilities": [],
                "code": "NATIVE_APP_AUTHENTICATION_REQUIRED"
            ]
        }
        return [
            "type": "leeway.extension.hello-ack", "version": 3, "helloId": helloId,
            "authenticated": true, "sessionId": session.id, "capabilities": [allowedCapability]
        ]
    }

    private func excerptResponse(_ message: [String: Any]) -> [String: Any] {
        let requestId = message["requestId"] as? String ?? ""
        let requestedSessionId = message["sessionId"] as? String ?? ""
        guard let session = qualifiedSession(), requestedSessionId == session.id,
              requestId.range(of: "^[A-Za-z0-9._:-]{8,128}$", options: .regularExpression) != nil,
              let excerpt = message["excerpt"] as? [String: Any], validExcerpt(excerpt) else {
            return [
                "type": "leeway.extension.receipt", "requestId": requestId,
                "sessionId": requestedSessionId, "accepted": false,
                "code": "NATIVE_APP_FORWARDING_NOT_QUALIFIED"
            ]
        }

        // The containing Apple Device Bridge app must consume an authenticated
        // owner session and forward this bounded request to its existing Bridge.
        // This extension never executes device operations and cannot claim a
        // receipt before that app-level forwarding is implemented and verified.
        return [
            "type": "leeway.extension.receipt", "requestId": requestId,
            "sessionId": session.id, "accepted": false,
            "code": "NATIVE_APP_FORWARDING_NOT_CONFIGURED"
        ]
    }

    private func validExcerpt(_ excerpt: [String: Any]) -> Bool {
        guard let href = excerpt["href"] as? String,
              let title = excerpt["title"] as? String,
              let selection = excerpt["selection"] as? String,
              let url = URL(string: href),
              ["http", "https"].contains(url.scheme?.lowercased() ?? "") else { return false }
        return href.count <= 2048 && title.count <= 256 && !selection.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && selection.count <= 8192
    }

    private func qualifiedSession() -> (id: String, expiresAt: Date)? {
        guard let session = UserDefaults(suiteName: appGroup)?.dictionary(forKey: sessionKey),
              session["authorizationState"] as? String == "OWNER_AUTHENTICATED_RUNTIME_GRANTED",
              let id = session["sessionId"] as? String,
              id.range(of: "^[A-Za-z0-9._:-]{8,128}$", options: .regularExpression) != nil,
              let expiresAt = session["expiresAt"] as? Date,
              expiresAt > Date() else { return nil }
        return (id, expiresAt)
    }

    private func respond(_ context: NSExtensionContext, _ message: [String: Any]) {
        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: message]
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
}
