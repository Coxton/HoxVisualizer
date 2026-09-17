#include <napi.h>

#include <windows.h>
#include <mmdeviceapi.h>
#include <audiopolicy.h>
#include <string>


std::string GetProcessName(DWORD processId)
{
    HANDLE processHandle = OpenProcess(
        PROCESS_QUERY_LIMITED_INFORMATION,
        FALSE,
        processId
    );

    if (processHandle == nullptr)
    {
        return "Unknown";
    }

    wchar_t processPath[MAX_PATH];
    DWORD pathSize = MAX_PATH;

    if (!QueryFullProcessImageNameW(
        processHandle,
        0,
        processPath,
        &pathSize
    ))
    {
        CloseHandle(processHandle);
        return "Unknown";
    }

    CloseHandle(processHandle);

    std::wstring fullPath(
        processPath,
        pathSize
    );

    size_t separator = fullPath.find_last_of(
        L"\\/"
    );

    if (separator == std::wstring::npos)
    {
        return std::string(
            fullPath.begin(),
            fullPath.end()
        );
    }

    std::wstring fileName = fullPath.substr(
        separator + 1
    );

    return std::string(
        fileName.begin(),
        fileName.end()
    );
}

Napi::Array GetSessions(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    HRESULT comResult = CoInitializeEx(
        nullptr,
        COINIT_MULTITHREADED
    );

    if (FAILED(comResult) && comResult != RPC_E_CHANGED_MODE)
    {
        Napi::Error::New(
            env,
            "Failed to initialize COM"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    IMMDeviceEnumerator* deviceEnumerator = nullptr;

    HRESULT result = CoCreateInstance(
        __uuidof(MMDeviceEnumerator),
        nullptr,
        CLSCTX_ALL,
        __uuidof(IMMDeviceEnumerator),
        reinterpret_cast<void**>(&deviceEnumerator)
    );

    if (FAILED(result))
    {
        if (SUCCEEDED(comResult))
        {
            CoUninitialize();
        }

        Napi::Error::New(
            env,
            "Failed to create Windows audio device enumerator"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    IMMDevice* device = nullptr;

    result = deviceEnumerator->GetDefaultAudioEndpoint(
        eRender,
        eConsole,
        &device
    );

    if (FAILED(result))
    {
        deviceEnumerator->Release();

        if (SUCCEEDED(comResult))
        {
            CoUninitialize();
        }

        Napi::Error::New(
            env,
            "Failed to get default audio device"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    IAudioSessionManager2* sessionManager = nullptr;

    result = device->Activate(
        __uuidof(IAudioSessionManager2),
        CLSCTX_ALL,
        nullptr,
        reinterpret_cast<void**>(&sessionManager)
    );

    if (FAILED(result))
    {
        device->Release();
        deviceEnumerator->Release();

        if (SUCCEEDED(comResult))
        {
            CoUninitialize();
        }

        Napi::Error::New(
            env,
            "Failed to activate audio session manager"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    IAudioSessionEnumerator* sessionEnumerator = nullptr;

    result = sessionManager->GetSessionEnumerator(
        &sessionEnumerator
    );

    if (FAILED(result))
    {
        sessionManager->Release();
        device->Release();
        deviceEnumerator->Release();

        if (SUCCEEDED(comResult))
        {
            CoUninitialize();
        }

        Napi::Error::New(
            env,
            "Failed to get audio session enumerator"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    int sessionCount = 0;

    result = sessionEnumerator->GetCount(
        &sessionCount
    );

    if (FAILED(result))
    {
        sessionEnumerator->Release();
        sessionManager->Release();
        device->Release();
        deviceEnumerator->Release();

        if (SUCCEEDED(comResult))
        {
            CoUninitialize();
        }

        Napi::Error::New(
            env,
            "Failed to get audio session count"
        ).ThrowAsJavaScriptException();

        return Napi::Array::New(env);
    }

    Napi::Array sessions = Napi::Array::New(env);

    int outputIndex = 0;

    for (int i = 0; i < sessionCount; i++)
    {
        IAudioSessionControl* sessionControl = nullptr;

        result = sessionEnumerator->GetSession(
            i,
            &sessionControl
        );

        if (FAILED(result))
        {
            continue;
        }

        IAudioSessionControl2* sessionControl2 = nullptr;

        result = sessionControl->QueryInterface(
            __uuidof(IAudioSessionControl2),
            reinterpret_cast<void**>(&sessionControl2)
        );

        if (FAILED(result))
        {
            sessionControl->Release();
            continue;
        }

        DWORD processId = 0;

        result = sessionControl2->GetProcessId(
            &processId
        );

        if (SUCCEEDED(result))
        {
                    std::string processName = GetProcessName(
            processId
        );

            Napi::Object session = Napi::Object::New(env);

            session.Set(
                "id",
                processId
            );

            session.Set(
                "name",
                processName
            );

            session.Set(
                "processId",
                processId
            );

            sessions.Set(
                outputIndex,
                session
            );

            outputIndex++;
        }

    }

    sessionEnumerator->Release();
    sessionManager->Release();
    device->Release();
    deviceEnumerator->Release();

    if (SUCCEEDED(comResult))
    {
        CoUninitialize();
    }

    return sessions;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(
        "getSessions",
        Napi::Function::New(env, GetSessions)
    );

    return exports;
}

NODE_API_MODULE(audio_sessions, Init)