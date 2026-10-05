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


    float vocalEnergy =
        smoothstep(
            0.14,
            0.65,
            uVocalIntensity
        );


    return max(
        bassEnergy,
        max(
            midEnergy,
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
        uVocalIntensity * 0.60;
}