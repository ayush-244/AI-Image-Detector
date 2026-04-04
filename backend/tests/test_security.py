import os


def test_env_examples_contain_security_keys():
    root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    backend_env_example = os.path.join(root, "backend", ".env.example")

    with open(backend_env_example, "r", encoding="utf-8") as file_obj:
        content = file_obj.read()

    assert "API_KEY=" in content
    assert "DEFAULT_RATE_LIMIT=" in content
    assert "ANALYZE_RATE_LIMIT=" in content
