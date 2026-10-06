float getBassResponse()
{
    return smoothstep(
        0.12,
        0.75,
        uBass
    );
}


float getLowMidResponse()
{
    return smoothstep(
        0.10,
        0.70,
        uLowMid
    );
}


float getMidResponse()
{
    return smoothstep(
        0.12,
        0.70,
        uMid
    );
}


float getHighMidResponse()
{
    return smoothstep(
        0.10,
        0.65,
        uHighMid
    );
}


float getTrebleResponse()
{
    return smoothstep(
        0.08,
        0.60,
        uTreble
    );
}


float getVocalResponse()
{
    return smoothstep(
        0.10,
        0.65,
        uVocalIntensity
    );
}


float getAudioIllumination()
{
    float bassEnergy =
        smoothstep(
            0.18,
            0.75,
            uBass
        );

    float midEnergy =
        smoothstep(
            0.16,
            0.70,
            uMid
        );

    float highMidEnergy =
        smoothstep(
            0.12,
            0.65,
            uHighMid
        );

    float trebleEnergy =
        smoothstep(
            0.10,
            0.60,
            uTreble
        );

    float vocalEnergy =
        smoothstep(
            0.14,
            0.65,
            uVocalIntensity
        );

    return max(
        max(bassEnergy, midEnergy),
        max(
            max(highMidEnergy, trebleEnergy),
            vocalEnergy
        )
    );
}


float getAudioDensity()
{
    return
        1.0 +
        uBass * 0.55 +
        uLowMid * 0.30 +
        uMid * 0.45 +
        uHighMid * 0.30 +
        uTreble * 0.18 +
        uVocalIntensity * 0.45;
}