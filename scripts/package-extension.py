"""
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.PACKAGING
TAG: LEEWAY.UNIVERSAL_EXTENSION.OS_PACKAGE.V2
5WH:
WHAT = Build reproducible unsigned Chrome/Edge and Firefox Operating System source bundles.
WHY = Ship one reviewed UI and original native-host courier without pretending to sign or enroll a device.
WHO = Creator-authorized outside GPT-6 source contributor under existing W01 packaging owner.
WHERE = scripts/package-extension.py in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Use platform-specific MV3 manifest, explicit asset allowlist and SHA-256 readback.
LICENSE = Existing repository terms apply; no new release license asserted.
"""
from hashlib import sha256
from json import dumps, loads
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo
from generate_extension_icons import generate, SIZES

root = Path(__file__).resolve().parents[1]
source, dist = root / 'extension', root / 'dist'
dist.mkdir(exist_ok=True)
generate(source / 'icons')
files = [
    'browser-polyfill.js', 'background.js', 'content-courier.js',
    'floating-tablet.js', 'operating-policy.js', 'service-retry.js',
    'operating-system.html', 'operating-system.css', 'operating-system.js'
] + [f'icons/leeway-{size}.png' for size in SIZES]
# Public customer bundle is allowlisted; the Creator Golden Master,
# full Tablet source, local models and enterprise application modules are
# never copied into a browser archive.
assert all((source / name).is_file() for name in files)
assert all(not name.startswith('/') and '..' not in Path(name).parts and
           not name.endswith(('.pem','.key','.p8','.onnx','.gguf','.db','.sqlite','.pt')) for name in files)
assert set(files)=={
 'browser-polyfill.js','background.js','content-courier.js','floating-tablet.js',
 'operating-policy.js','service-retry.js','operating-system.html',
 'operating-system.css','operating-system.js',
 *[f'icons/leeway-{size}.png' for size in SIZES]
}
artifacts = {}
for browser, manifest_name in (
    ('chromium', 'manifest.json'),
    ('firefox', 'manifest.firefox.json')
):
    manifest_bytes = (source / manifest_name).read_bytes()
    manifest = loads(manifest_bytes)
    assert manifest['manifest_version'] == 3
    assert manifest['name'] == 'LeeWay Operating System'
    assert manifest.get('icons') == {str(size): f'icons/leeway-{size}.png' for size in SIZES}
    assert manifest['action']['default_icon'] == manifest['icons']
    assert 'https://*/*' in manifest['optional_host_permissions']
    assert 'host_permissions' not in manifest
    assert 'content_scripts' not in manifest
    if browser == 'chromium':
        assert manifest['side_panel']['default_path'] == 'operating-system.html'
        assert 'sidePanel' in manifest['permissions']
        assert manifest['background']['service_worker'] == 'background.js'
    else:
        assert manifest['sidebar_action']['default_panel'] == 'operating-system.html'
        assert manifest['background']['scripts'] == [
            'browser-polyfill.js', 'background.js'
        ]
        assert 'sidePanel' not in manifest['permissions']
    name = 'leeway-operating-system-' + browser + '-UNSIGNED.zip'
    archive = dist / name
    with ZipFile(archive, 'w', compression=ZIP_DEFLATED, compresslevel=9) as output:
        for target, payload in [('manifest.json', manifest_bytes)] + [
            (asset, (source / asset).read_bytes()) for asset in files
        ]:
            info = ZipInfo(target, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            output.writestr(info, payload)
    assert archive.stat().st_size <= 256 * 1024, 'CUSTOMER_BUNDLE_EXCEEDS_LIGHTWEIGHT_BUDGET'
    with ZipFile(archive) as proof:
        assert proof.testzip() is None
        assert len(proof.namelist()) == len(files) + 1
    artifacts[name] = sha256(archive.read_bytes()).hexdigest()
(dist / 'SHA256SUMS.json').write_text(
    dumps({'classification': 'UNSIGNED_SOURCE_NOT_INSTALLED_OR_PRODUCTION_QUALIFIED',
           'artifacts': artifacts}, indent=2) + '\n', encoding='utf8'
)
for name, digest in artifacts.items():
    print(f'{name} sha256={digest}')
