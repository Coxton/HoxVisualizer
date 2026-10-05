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
        clamp(
            distanceFactor +
            variation,
            0.0,
            1.0
        );


    vec3 color;


    if (factor < 0.34)
    {
        color =
            mix(
                uOuterColor,
                uMidColor,
                factor / 0.34
            );
    }
    else if (factor < 0.62)
    {
        color =
            mix(
                uMidColor,
                uVioletColor,
                (factor - 0.34) / 0.28
            );
    }
    else
    {
        color =
            mix(
                uVioletColor,
                uInnerColor,
                (factor - 0.62) / 0.38
            );
    }


    float pink =
        1.0 -
        smoothstep(
            0.05,
            0.34,
            factor
        );


    float magenta =
        smoothstep(
            0.18,
            0.32,
            factor
        ) *
        (
            1.0 -
            smoothstep(
                0.32,
                0.50,
                factor
            )
        );


    float violet =
        smoothstep(
            0.42,
            0.58,
            factor
        ) *
        (
            1.0 -
            smoothstep(
                0.58,
                0.72,
                factor
            )
        );


    float blue =
        smoothstep(
            0.62,
            0.88,
            factor
        );


    color *=
        1.0 +
        pink * 0.22 +
        magenta * 0.28 +
        violet * 0.16 +
        blue * 0.20;


    return color;
}