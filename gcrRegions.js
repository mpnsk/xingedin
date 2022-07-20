// ms values from https://gcping.com/
const regions = [
    {
        location: 'zürich',
        region: 'europe-west6',
        ms: 29,
        lowCo2: true,
        priceLevel: 2
    },
    {
        location: 'frankfurt',
        region: 'europe-west3',
        ms: 31,
        lowCo2: false,
        priceLevel: 2
    }, {
        location: 'milan',
        region: 'europe-west8',
        ms: 32,
        lowCo2: false,
        priceLevel: 1
    }, {
        location: 'netherlands',
        region: 'europe-west4',
        ms: 37,
        lowCo2: false,
        priceLevel: 1
    }, {
        location: 'belgium',
        region: 'europe-west1',
        ms: 39,
        lowCo2: true,
        priceLevel: 1
    }, {
        location: 'paris',
        region: 'europe-west9',
        ms: 40,
        lowCo2: true,
        priceLevel: 1
    }, {
        location: 'london',
        region: 'europe-west2',
        ms: 41,
        lowCo2: false,
        priceLevel: 2
    }, {
        location: 'warsaw',
        region: 'europe-central2',
        ms: 42,
        lowCo2: false,
        priceLevel: 2
    }, {
        location: 'finland',
        region: 'europe-north1',
        ms: 53,
        lowCo2: true,
        priceLevel: 1
    }, {
        location: 'madrid',
        region: 'europe-southwest1',
        ms: 53,
        lowCo2: true,
        priceLevel: 1
    }
]

const sorted = regions.sort((a, b) => a.ms - b.ms);
console.table(sorted)