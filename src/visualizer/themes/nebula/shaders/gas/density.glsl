void getCloudData(
    vec3 flowedPosition,
    out float largeCloud,
    out float mediumCloud,
    out float fineCloud,
    out float filamentNoise
)
{
    largeCloud =
        noise(
            flowedPosition *
            0.32
        );


    mediumCloud =
        noise(
            flowedPosition *
            0.78
        );


    fineCloud =
        noise(
            flowedPosition *
            1.65
        );


    filamentNoise =
        noise(
            flowedPosition *
            3.4
        );
}


float getCloudDensity(
    float largeCloud,
    float mediumCloud,
    float fineCloud,
    float filamentNoise
)
{
    float cloud =
        largeCloud * 0.48 +
        mediumCloud * 0.30 +
        fineCloud * 0.14 +
        filamentNoise * 0.08;


    float structure =
        smoothstep(
            0.36,
            0.68,
            cloud
        );


    float wisps =
        smoothstep(
            0.48,
            0.72,
            fineCloud
        );


    float filament =
        smoothstep(
            0.55,
            0.78,
            filamentNoise
        );


    float sampleDensity =
        structure *
        (
            0.48 +
            wisps * 0.34 +
            filament * 0.28
        );


    float audioDensity =
        getAudioDensity();


    float densityContrast =
        1.0 +
        audioDensity *
        0.55;


    sampleDensity =
        pow(
            sampleDensity,
            1.0 /
            densityContrast
        );


    sampleDensity *=
        audioDensity;


    return sampleDensity;
}