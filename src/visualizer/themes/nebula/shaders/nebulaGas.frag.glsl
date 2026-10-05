uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform vec3 uCorePosition;
uniform float uCoreIntensity;

uniform vec3 uOuterColor;
uniform vec3 uMidColor;
uniform vec3 uVioletColor;
uniform vec3 uInnerColor;

uniform float uTime;

uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uVocalIntensity;

varying vec3 vLocalPosition;


float hash(vec3 p)
{
    p = fract(
        p * 0.3183099 +
        vec3(0.1, 0.2, 0.3)
    );

    p *= 17.0;

    return fract(
        p.x *
        p.y *
        p.z *
        (p.x + p.y + p.z)
    );
}


float noise(vec3 p)
{
    vec3 cell =
        floor(p);

    vec3 local =
        fract(p);

    local =
        local *
        local *
        (3.0 - 2.0 * local);


    float c000 =
        hash(
            cell +
            vec3(0.0, 0.0, 0.0)
        );

    float c100 =
        hash(
            cell +
            vec3(1.0, 0.0, 0.0)
        );

    float c010 =
        hash(
            cell +
            vec3(0.0, 1.0, 0.0)
        );

    float c110 =
        hash(
            cell +
            vec3(1.0, 1.0, 0.0)
        );

    float c001 =
        hash(
            cell +
            vec3(0.0, 0.0, 1.0)
        );

    float c101 =
        hash(
            cell +
            vec3(1.0, 0.0, 1.0)
        );

    float c011 =
        hash(
            cell +
            vec3(0.0, 1.0, 1.0)
        );

    float c111 =
        hash(
            cell +
            vec3(1.0, 1.0, 1.0)
        );


    float x00 =
        mix(
            c000,
            c100,
            local.x
        );

    float x10 =
        mix(
            c010,
            c110,
            local.x
        );

    float x01 =
        mix(
            c001,
            c101,
            local.x
        );

    float x11 =
        mix(
            c011,
            c111,
            local.x
        );


    float y0 =
        mix(
            x00,
            x10,
            local.y
        );

    float y1 =
        mix(
            x01,
            x11,
            local.y
        );


    return mix(
        y0,
        y1,
        local.z
    );
}


float nebulaNoise(vec3 p)
{
    float large =
        noise(
            p * 0.35
        );

    float medium =
        noise(
            p * 0.8
        );

    float fine =
        noise(
            p * 1.8
        );


    return
        large * 0.50 +
        medium * 0.32 +
        fine * 0.18;
}


vec3 flowPosition(
    vec3 position,
    float time
)
{
    vec3 flowedPosition =
        position;


    float largeFlow =
        time * 0.06;


    float bassFlow =
        0.35 +
        uBass * 0.75 +
        uLowMid * 0.30;


    flowedPosition.x +=
        sin(
            position.z * 0.45 +
            largeFlow
        ) *
        bassFlow;


    flowedPosition.y +=
        sin(
            position.x * 0.35 +
            largeFlow * 0.8
        ) *
        (
            0.20 +
            uLowMid * 0.35
        );


    flowedPosition.z +=
        cos(
            position.y * 0.40 +
            largeFlow * 0.9
        ) *
        (
            0.30 +
            uLowMid * 0.40
        );


    float turbulence =
        time * 0.15;


    float midFlow =
        0.12 +
        uMid * 0.40;


    flowedPosition.x +=
        sin(
            position.y * 1.3 +
            turbulence
        ) *
        midFlow;


    flowedPosition.y +=
        cos(
            position.z * 1.1 +
            turbulence * 0.8
        ) *
        (
            0.10 +
            uMid * 0.30
        );


    flowedPosition.z +=
        sin(
            position.x * 1.5 +
            turbulence * 1.1
        ) *
        (
            0.12 +
            uMid * 0.32
        );


    return flowedPosition;
}


vec3 getGasColor(
    float distanceFactor,
    float localNoise
)
{
    float variation =
        (
            localNoise -
            0.5
        ) *
        0.18;


    float factor =
        distanceFactor * 0.70 +
        variation;


    float blueResponse =
        clamp(
            uMid * 0.28 +
            uVocalIntensity * 0.34,
            0.0,
            0.28
        );


    factor +=
        blueResponse;


    factor =
        clamp(
            factor,
            0.0,
            1.0
        );


    if (factor < 0.35)
    {
        return mix(
            uOuterColor,
            uMidColor,
            factor / 0.35
        );
    }


    if (factor < 0.60)
    {
        return mix(
            uMidColor,
            uVioletColor,
            (factor - 0.35) / 0.25
        );
    }


    return mix(
        uVioletColor,
        uInnerColor,
        (factor - 0.60) / 0.40
    );
}


void main()
{
    vec3 rayDirection =
        normalize(
            vLocalPosition -
            uCameraPosition
        );


    float rayLength =
        length(
            vLocalPosition -
            uCameraPosition
        );


    float density =
        0.0;

    float emission =
        0.0;

    vec3 accumulatedColor =
        vec3(0.0);

    float accumulatedColorWeight =
        0.0;


    float stepSize =
        0.20;


    for (int i = 0; i < 24; i++)
    {
        float distance =
            float(i) *
            stepSize;


        if (distance >= rayLength)
        {
            break;
        }


        vec3 rayPosition =
            uCameraPosition +
            rayDirection *
            distance;


        vec3 flowedPosition =
            flowPosition(
                rayPosition,
                uTime
            );


        float largeCloud =
            noise(
                flowedPosition *
                0.35
            );


        float mediumCloud =
            noise(
                flowedPosition *
                0.85
            );


        float fineCloud =
            noise(
                flowedPosition *
                1.8
            );


        float gas =
            largeCloud * 0.55 +
            mediumCloud * 0.30 +
            fineCloud * 0.15;


        float sampleDensity =
            smoothstep(
                0.42,
                0.68,
                gas
            );


        sampleDensity *=
            0.55 +
            mediumCloud * 0.85;


        float coreDistance =
            length(
                rayPosition -
                uCorePosition
            );


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


        float bassEnergy =
            uBass *
            1.8;


        float midEnergy =
            uMid *
            1.6;


        float vocalEnergy =
            uVocalIntensity *
            2.0;


        float illumination =
            0.08;


        illumination +=
            lightFalloff *
            1.8;


        illumination +=
            coreLight *
            uCoreIntensity *
            0.55;


        illumination +=
            bassEnergy *
            outerRegion *
            0.65;


        illumination +=
            midEnergy *
            innerRegion *
            0.75;


        illumination +=
            vocalEnergy *
            innerRegion *
            0.85;


        float audioDensity =
            1.0 +
            uBass * 0.55 +
            uLowMid * 0.30 +
            uMid * 0.45 +
            uVocalIntensity * 0.60;


        float sampleContribution =
            sampleDensity *
            illumination *
            audioDensity *
            0.009;


        density +=
            sampleContribution;


        float distanceFactor =
            1.0 -
            smoothstep(
                0.8,
                4.8,
                coreDistance
            );


        float localColorNoise =
            largeCloud * 0.45 +
            mediumCloud * 0.35 +
            fineCloud * 0.20;


        vec3 sampleColor =
            getGasColor(
                distanceFactor,
                localColorNoise
            );


        accumulatedColor +=
            sampleColor *
            sampleContribution;


        accumulatedColorWeight +=
            sampleContribution;


        emission +=
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


    density =
        clamp(
            density,
            0.0,
            0.72
        );


    emission =
        clamp(
            emission,
            0.0,
            0.8
        );


    vec3 gasColor =
        accumulatedColor /
        max(
            accumulatedColorWeight,
            0.0001
        );


    float audioGlow =
        1.0 +
        uBass * 0.18 +
        uMid * 0.26 +
        uVocalIntensity * 0.34;


    gasColor *=
        audioGlow;


    gasColor *=
        1.0 +
        emission * 1.6;


    gl_FragColor =
        vec4(
            gasColor,
            density
        );
}