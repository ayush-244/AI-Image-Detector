from pathlib import Path


def test_health_route_is_defined_in_backend_app():
    app_file = Path(__file__).resolve().parents[1] / "app.py"
    content = app_file.read_text(encoding="utf-8")

    assert '@app.route("/health"' in content
    assert "def health_check" in content
