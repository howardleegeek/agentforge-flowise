import os


def test_docker_compose_defines_agentforge_image_and_env_vars():
    with open('docker-compose.yml', 'r', encoding='utf-8') as f:
        content = f.read()

    assert 'image: agentforge' in content, "docker-compose.yml must set image to 'agentforge'"
    assert 'DISPATCH_ENABLED' in content, "docker-compose.yml must reference DISPATCH_ENABLED env"
    assert 'DISPATCH_CONTROLLER_URL' in content, "docker-compose.yml must reference DISPATCH_CONTROLLER_URL env"


def test_env_example_contains_dispatch_doc():
    path = '.env.example'
    assert os.path.exists(path), ".env.example must exist for environment docs"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'DISPATCH_CONTROLLER_URL' in content, ".env.example must document DISPATCH_CONTROLLER_URL"
    assert 'DISPATCH_ENABLED' in content, ".env.example must document DISPATCH_ENABLED"
    assert 'DISPATCH_ENABLED_PROD' in content, ".env.example must define DISPATCH_ENABLED_PROD"
    assert 'DISPATCH_CONTROLLER_URL_PROD' in content, ".env.example must define DISPATCH_CONTROLLER_URL_PROD"


def test_prod_compose_overrides_dispatch_env():
    path = 'docker-compose.prod.yml'
    assert os.path.exists(path), "docker-compose.prod.yml must exist"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert 'DISPATCH_ENABLED_PROD' in content, "docker-compose.prod.yml must use DISPATCH_ENABLED_PROD"
    assert (
        'DISPATCH_CONTROLLER_URL_PROD' in content
    ), "docker-compose.prod.yml must use DISPATCH_CONTROLLER_URL_PROD"
