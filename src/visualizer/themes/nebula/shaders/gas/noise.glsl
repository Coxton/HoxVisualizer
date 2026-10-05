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


float flowNoise(vec3 p)
{
    float large =
        noise(
            p * 0.32
        );

    float medium =
        noise(
            p * 0.72
        );

    float fine =
        noise(
            p * 1.55
        );

    float filament =
        noise(
            p * 3.2
        );


    return
        large * 0.46 +
        medium * 0.30 +
        fine * 0.16 +
        filament * 0.08;
}