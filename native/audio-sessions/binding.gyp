{
    "targets": [
        {
            "target_name": "audio_sessions",
            "sources": [
                "AudioSessions.cpp"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "defines": [
                "NAPI_CPP_EXCEPTIONS"
            ],
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "ExceptionHandling": 1
                }
            }
        }
    ]
}