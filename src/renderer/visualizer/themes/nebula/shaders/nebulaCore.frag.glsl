uniform vec3 uCameraPosition;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform float uIntensity;

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
    vec3 cell = floor(p);
    vec3 local = fract(p);

    local =
        local *
        local *
        (3.0 - 2.0 * local);

    float c000 = hash(cell + vec3(0.0, 0.0, 0.0));
    float c100 = hash(cell + vec3(1.0, 0.0, 0.0));
    float c010 = hash(cell + vec3(0.0, 1.0, 0.0));
    float c110 = hash(cell + vec3(1.0, 1.0, 0.0));

    float c001 = hash(cell + vec3(0.0, 0.0, 1.0));
    float c101 = hash(cell + vec3(1.0, 0.0, 1.0));
    float c011 = hash(cell + vec3(0.0, 1.0, 1.0));
    float c111 = hash(cell + vec3(1.0, 1.0, 1.0));

    float x00 = mix(c000, c100, local.x);
    float x10 = mix(c010, c110, local.x);

    float x01 = mix(c001, c101, local.x);
    float x11 = mix(c011, c111, local.x);

    float y0 = mix(x00, x10, local.y);
    float y1 = mix(x01, x11, local.y);

    return mix(y0, y1, local.z);
}

float nebulaNoise(vec3 p)
{
    float large =
        noise(p * 0.35);

    float medium =
        noise(p * 0.8);

    float small =
        noise(p * 1.6);

    float fine =
        noise(p * 3.2);

    return
        large * 0.45 +
        medium * 0.30 +
        small * 0.18 +
        fine * 0.07;
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

    float density = 0.0;
    float emissionAmount = 0.0;

    float stepSize = 0.08;

    for (int i = 0; i < 64; i++)
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

        vec3 normalizedPosition =
            rayPosition /
            vec3(1.0);

        float radius =
            length(normalizedPosition);

        float shapeNoise =
            nebulaNoise(
                rayPosition * 1.15
            );

        float distortedRadius =
            radius -
            (shapeNoise - 0.5) *
            0.25;

        float volume =
            1.0 -
            smoothstep(
                0.35,
                0.5,
                distortedRadius
            );

        float sampleDensity =
            nebulaNoise(
                rayPosition * 2.5
            );

        sampleDensity =
            smoothstep(
                0.48,
                0.72,
                sampleDensity
            );

        sampleDensity *= volume;

        float illumination =
            0.15 +
            uIntensity *
            (1.0 - smoothstep(
                0.0,
                1.5,
                radius
            ));

        float emission =
            uIntensity *
            (1.0 - smoothstep(
                0.0,
                1.0,
                radius
            ));

        density +=
            sampleDensity *
            illumination *
            0.03;

        emissionAmount +=
            sampleDensity *
            emission *
            0.03;
    }

    density =
        clamp(
            density,
            0.0,
            0.8
        );

    emissionAmount =
        clamp(
            emissionAmount,
            0.0,
            0.8
        );

    float colorFactor =
        smoothstep(
            0.0,
            0.5,
            emissionAmount
        );

    vec3 gasColor =
        mix(
            uCoreColor,
            uGlowColor,
            colorFactor
        );

    gl_FragColor =
        vec4(
            gasColor,
            density
        );
}