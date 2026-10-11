
float getBassResponse()
{
    return pow(
        clamp(uBass, 0.0, 1.0),
        0.78
    );
}

float getLowMidResponse()
{
    return pow(
        clamp(uLowMid, 0.0, 1.0),
        0.82
    );
}

float getMidResponse()
{
    return pow(
        clamp(uMid, 0.0, 1.0),
        0.78
    );
}

float getHighMidResponse()
{
    return pow(
        clamp(uHighMid, 0.0, 1.0),
        0.72
    );
}

float getTrebleResponse()
{
    return pow(
        clamp(uTreble, 0.0, 1.0),
        0.68
    );
}

float getVocalResponse()
{
    return pow(
        clamp(uVocalIntensity, 0.0, 1.0),
        0.78
    );
}

float getImpactResponse()
{
    return smoothstep(
        0.04,
        0.72,
        clamp(uImpact, 0.0, 1.0)
    );
}

float getAudioIllumination()
{
    float bassEnergy =
        getBassResponse();

    float lowMidEnergy =
        getLowMidResponse();

    float midEnergy =
        getMidResponse();

    float highMidEnergy =
        getHighMidResponse();

    float trebleEnergy =
        getTrebleResponse();

    float vocalEnergy =
        getVocalResponse();

    return clamp(
        bassEnergy * 0.18 +
        lowMidEnergy * 0.16 +
        midEnergy * 0.20 +
        highMidEnergy * 0.20 +
        trebleEnergy * 0.12 +
        vocalEnergy * 0.14,
        0.0,
        1.0
    );
}

float getAudioDensity()
{
    return
        1.0 +
        getBassResponse() * 0.34 +
        getLowMidResponse() * 0.24 +
        getMidResponse() * 0.30 +
        getHighMidResponse() * 0.30 +
        getTrebleResponse() * 0.24 +
        getVocalResponse() * 0.24 +
        getImpactResponse() * 0.18;
}
