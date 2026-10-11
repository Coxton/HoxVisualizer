float getIllumination(
    vec3 rayPosition,
    float coreDistance,
    float audioIllumination
)
{
    float illumination = 0.0;

    float innerRegion =
        1.0 -
        smoothstep(
            0.5,
            4.0,
            coreDistance
        );

    float outerRegion =
        smoothstep(
            2.0,
            7.2,
            coreDistance
        );

    float coreLight =
        1.0 -
        smoothstep(
            0.4,
            4.5,
            coreDistance
        );

    float lightDistance =
        length(
            rayPosition -
            uLightPosition
        );

    float lightFalloff =
        1.0 -
        smoothstep(
            0.5,
            4.0,
            lightDistance
        );

    illumination +=
        lightFalloff *
        1.75;

    illumination +=
        coreLight *
        uCoreIntensity *
        0.58;

    illumination +=
        audioIllumination *
        outerRegion *
        0.72;

    illumination +=
        audioIllumination *
        innerRegion *
        0.82;

    return illumination;
}

float getEmission(
    float sampleDensity,
    float coreDistance
)
{
    float innerRegion =
        1.0 -
        smoothstep(
            0.5,
            4.0,
            coreDistance
        );

    float outerRegion =
        smoothstep(
            2.0,
            7.2,
            coreDistance
        );

    float bassEnergy =
        getBassResponse();

    float midEnergy =
        getMidResponse();

    float highMidEnergy =
        getHighMidResponse();

    float trebleEnergy =
        getTrebleResponse();

    float vocalEnergy =
        getVocalResponse();

    float impactEnergy =
        getImpactResponse();

    return
        sampleDensity *
        (
            bassEnergy *
            outerRegion *
            0.018 +

            midEnergy *
            innerRegion *
            0.020 +

            highMidEnergy *
            innerRegion *
            0.018 +

            trebleEnergy *
            outerRegion *
            0.012 +

            vocalEnergy *
            innerRegion *
            0.022 +

            impactEnergy *
            innerRegion *
            0.025
        );
}

float getAudioGlow()
{
    return
        1.0 +
        getBassResponse() * 0.14 +
        getMidResponse() * 0.16 +
        getHighMidResponse() * 0.12 +
        getTrebleResponse() * 0.08 +
        getVocalResponse() * 0.14;
}