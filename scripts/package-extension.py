"""
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.PACKAGING
TAG: LEEWAY.UNIVERSAL_EXTENSION.PACKAGE.V1
5WH:
WHAT: Build deterministic unsigned source packages for platform signing workflows.
WHY: Preserve one inspected source lineage without claiming installation or production admission.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: scripts/package-extension.py.
WHEN: 2026-11-19.
HOW: Archive an explicit allow-list and emit SHA-256 evidence.
LICENSE: Existing repository terms apply.
"""
from hashlib import sha256
from json import dumps, loads
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo
root = Path(__file__).resolve().parents[1]
source, dist = root / 'extension', root / 'dist'
dist.mkdir(exist_ok=True)
files = ['manifest.json', 'browser-polyfill.js', 'background.js', 'content-courier.js', 'floating-tablet.js']
manifest = loads((source / 'manifest.json').read_text(encoding='utf8'))
assert manifest['manifest_version'] == 3
assert set(manifest['permissions']) == {'activeTab', 'scripting', 'nativeMessaging'}
archive = dist / 'leeway-universal-extension-unsigned.zip'
with ZipFile(archive, 'w', compression=ZIP_DEFLATED, compresslevel=9) as output:
    for name in files:
        info = ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0)); info.compress_type = ZIP_DEFLATED; info.external_attr = 0o644 << 16
        output.writestr(info, (source / name).read_bytes())
with ZipFile(archive) as proof:
    assert proof.testzip() is None
digest = sha256(archive.read_bytes()).hexdigest()
(dist / 'SHA256SUMS.json').write_text(dumps({'classification': 'UNSIGNED_SOURCE_PACKAGE_NOT_INSTALLED', 'artifact': archive.name, 'sha256': digest}, indent=2) + '\n', encoding='utf8')
print(f'{archive.name} sha256={digest}')
