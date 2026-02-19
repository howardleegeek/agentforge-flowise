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
