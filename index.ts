import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import * as g from "@pulumi/google-native"
import {RandomString} from "@pulumi/random/randomString";


const imageName = "crawler"
const project = "xingedin"
const belgium = 'europe-west1'
const location = belgium

const myImage = new docker.Image(imageName, {
    imageName: pulumi.interpolate`gcr.io/${project}/${imageName}`,
    build: {
        context: "./gcr-crawler"
    }
})
const randomString = new RandomString("service-name", {
    upper: false,
    number: false,
    special: false,
    length: 8,
});
const serviceName = pulumi.interpolate`run-${randomString.result}`;
const crawler = new g.run.v1.Service("crawler", {
    apiVersion: "serving.knative.dev/v1",
    kind: "Service",
    metadata: {name: serviceName},
    spec: {
        template: {
            metadata: {
                annotations: {
                    "autoscaling.knative.dev/maxScale": "23"
                }
            },
            spec: {
                containers: [{
                    image: myImage.imageName,
                }],
                containerConcurrency: 3,
            }
        }
    },
    project,
    location,
});

const iamYolo = new g.run.v1.ServiceIamPolicy("allow-all", {
    serviceId: crawler.metadata.name,
    bindings: [{
        members: ["allUsers"],
        role: "roles/run.invoker"
    }],
    project,
    location
})

// Export the DNS name of the bucket
export const crawlerUrl = crawler.status.url;
