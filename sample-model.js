var model = {
    structure: {
        a: 50, // input
        b: { // fieldset>inputs
            d: 'foo',
            e: 'bar',
            moo: {
                m: 'moo',
                n: 'noo'
            },
            coo: {
                nofollow: true,
                coocoo: 'tee',
                bear: {
                    bar: 'bean'
                }
            }
        },
        c: [{ // fieldset>ul>li>inputs
            f: 'baz',
            g: 'biz'
        },
        { // fieldset>ul>li>inputs
            f: 'bar',
            g: 'bir'
        }],
        h: { // select
            options: [7, 8, 9, 10],
            value: 7
        },
        i: { // range
            min: 0,
            max: 15,
            step: 1,
            value: 12
        },
        j: { // radios
            radios: [7, 8],
            value: 7
        },
        k: { // checkboxes
            checkboxes: [7, 8],
            values: [7, 8]
        }
    }
};