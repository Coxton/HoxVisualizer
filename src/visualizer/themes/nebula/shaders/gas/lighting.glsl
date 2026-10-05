float getIllumination(
    vec3 rayPosition,
    float coreDistance,
    float audioIllumination
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


    float illumination =
        0.10;


    illumination +=
        lightFalloff *
        1.8;


    illumination +=
        coreLight *
        uCoreIntensity *
        0.55;


    illumination +=
        audioIllumination *
        outerRegion *
        0.85;


    illumination +=
        audioIllumination *
        innerRegion *
        1.00;


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
        uBass *
        1.8;


    float midEnergy =
        uMid *
        1.6;


    float vocalEnergy =
        uVocalIntensity *
        2.0;


    return
        sampleDensity *
        (
            bassEnergy *
            outerRegion *
            0.020 +

            midEnergy *
            innerRegion *
            0.028 +

            vocalEnergy *
            innerRegion *
            0.035
        );
}


float getAudioGlow()
{
    return
        1.0 +
        uBass * 0.18 +
        uMid * 0.26 +
        uVocalIntensity * 0.34;
}