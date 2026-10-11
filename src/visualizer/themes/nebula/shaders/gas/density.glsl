
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
            flowedPosition * 0.28
        );

    mediumCloud =
        noise(
            flowedPosition * 0.72
        );

    fineCloud =
        noise(
            flowedPosition * 1.65
        );

    filamentNoise =
        noise(
            flowedPosition * 3.8
        );
}

float getCloudDensity(
    vec3 samplePosition,
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

    float impactResponse =
        getImpactResponse();

    float distanceFromCore =
        length(
            samplePosition -
            uCorePosition
        );

    float outerRegion =
        smoothstep(
            2.2,
            6.8,
            distanceFromCore
        );

    float lowMidRegion =
        smoothstep(
            1.6,
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
            1.0,
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
            0.46,
            0.73,
            fineCloud
        );

    float filamentLayer =
        smoothstep(
            0.52,
            0.79,
            filamentNoise
        );

    float bassLayer =
    largeLayer *
    (
        0.78 +
        bassResponse * 0.92
    ) *
    (
        0.55 +
        outerRegion * 0.82
    );

float lowMidLayer =
    mediumLayer *
    (
        0.72 +
        lowMidResponse * 0.92
    ) *
    (
        0.58 +
        lowMidRegion * 0.68
    );

float midLayer =
    fineLayer *
    (
        0.48 +
        midResponse * 1.12
    ) *
    (
        0.45 +
        midRegion * 0.92
    );

float highMidLayer =
    filamentLayer *
    (
        0.16 +
        highMidResponse * 1.55
    ) *
    (
        0.30 +
        highMidRegion * 1.05
    );

float vocalLayer =
    filamentLayer *
    (
        0.12 +
        vocalResponse * 1.00
    ) *
    (
        0.30 +
        coreRegion * 0.95
    );

float ultraFine =
    smoothstep(
        0.56,
        0.83,
        filamentNoise
    );

float trebleLayer =
    ultraFine *
    (
        0.06 +
        trebleResponse * 1.05
    ) *
    (
        0.45 +
        outerRegion * 0.60
    );

    float impactLayer =
        largeLayer *
        impactResponse *
        (
            0.25 +
            outerRegion * 0.75
        );

        float cloudDensity =
        bassLayer * 0.31 +
        lowMidLayer * 0.25 +
    midLayer * 0.22 +
        highMidLayer * 0.12 +
        vocalLayer * 0.05 +
        trebleLayer * 0.05 +
        impactLayer * 0.12;

    float fineContrast =
        1.0 +
        midResponse * 0.18 +
        highMidResponse * 0.42 +
        trebleResponse * 0.32;

    cloudDensity =
        pow(
            max(cloudDensity, 0.0),
            1.0 / fineContrast
        );

    float audioDensity =
        getAudioDensity();

    cloudDensity *=
        1.04 +
        audioDensity * 0.075;

    return cloudDensity;
}
