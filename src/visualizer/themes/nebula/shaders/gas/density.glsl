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
            0.28
        );

    mediumCloud =
        noise(
            flowedPosition *
            0.72
        );

    fineCloud =
        noise(
            flowedPosition *
            1.65
        );

    filamentNoise =
        noise(
            flowedPosition *
            3.8
        );
}


float getCloudDensity(
    float largeCloud,
    float mediumCloud,
    float fineCloud,
    float filamentNoise
)
{
    float bassResponse =
        getBassResponse();

    float lowMidResponse =
        getLowMidResponse();

    float midResponse =
        getMidResponse();

    float highMidResponse =
        getHighMidResponse();

    float trebleResponse =
        getTrebleResponse();

    float vocalResponse =
        getVocalResponse();


    float distanceFromCore =
        length(
            vLocalPosition -
            uCorePosition
        );


    float outerRegion =
        smoothstep(
            2.5,
            6.8,
            distanceFromCore
        );


    float lowMidRegion =
        smoothstep(
            1.8,
            5.8,
            distanceFromCore
        );


    float midRegion =
        1.0 -
        smoothstep(
            0.8,
            4.8,
            distanceFromCore
        );


    float highMidRegion =
        1.0 -
        smoothstep(
            1.2,
            5.0,
            distanceFromCore
        );


    float coreRegion =
        1.0 -
        smoothstep(
            0.5,
            3.2,
            distanceFromCore
        );


    float largeLayer =
        smoothstep(
            0.38,
            0.68,
            largeCloud
        );


    float mediumLayer =
        smoothstep(
            0.40,
            0.70,
            mediumCloud
        );


    float fineLayer =
        smoothstep(
            0.48,
            0.74,
            fineCloud
        );


    float filamentLayer =
        smoothstep(
            0.54,
            0.80,
            filamentNoise
        );


    float bassLayer =
        largeLayer *
        (
            0.62 +
            bassResponse * 0.78
        ) *
        (
            0.45 +
            outerRegion * 0.75
        );


    float lowMidLayer =
        mediumLayer *
        (
            0.52 +
            lowMidResponse * 0.78
        ) *
        (
            0.55 +
            lowMidRegion * 0.60
        );


    float midLayer =
        fineLayer *
        (
            0.34 +
            midResponse * 1.05
        ) *
        (
            0.40 +
            midRegion * 0.85
        );


    float highMidLayer =
        filamentLayer *
        (
            0.12 +
            highMidResponse * 1.20
        ) *
        (
            0.30 +
            highMidRegion * 0.95
        );


    float vocalLayer =
        filamentLayer *
        (
            0.10 +
            vocalResponse * 0.85
        ) *
        (
            0.30 +
            coreRegion * 0.90
        );


    float ultraFine =
        smoothstep(
            0.58,
            0.84,
            filamentNoise
        );


    float trebleLayer =
        ultraFine *
        (
            0.04 +
            trebleResponse * 0.72
        ) *
        (
            0.45 +
            outerRegion * 0.55
        );


    float cloudDensity =
        bassLayer * 0.32 +
        lowMidLayer * 0.27 +
        midLayer * 0.23 +
        highMidLayer * 0.09 +
        vocalLayer * 0.06 +
        trebleLayer * 0.03;


    float fineContrast =
        1.0 +
        midResponse * 0.20 +
        highMidResponse * 0.38 +
        trebleResponse * 0.20;


    cloudDensity =
        pow(
            cloudDensity,
            1.0 /
            fineContrast
        );


    float audioDensity =
        getAudioDensity();


    cloudDensity *=
        0.90 +
        audioDensity * 0.11;


    return cloudDensity;
}