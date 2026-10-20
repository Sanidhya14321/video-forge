import { z } from 'zod';
export type Vec3 = [number, number, number];
export declare const cameraKeySchema: z.ZodObject<{
    at: z.ZodNumber;
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    fov: z.ZodDefault<z.ZodNumber>;
    roll: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const worldSchema: z.ZodObject<{
    camera: z.ZodObject<{
        interpolation: z.ZodDefault<z.ZodEnum<{
            linear: "linear";
            smooth: "smooth";
        }>>;
        keys: z.ZodArray<z.ZodObject<{
            at: z.ZodNumber;
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            fov: z.ZodDefault<z.ZodNumber>;
            roll: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    objects: z.ZodArray<z.ZodObject<{
        size: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
        color: z.ZodDefault<z.ZodString>;
        roughness: z.ZodDefault<z.ZodNumber>;
        metalness: z.ZodDefault<z.ZodNumber>;
        src: z.ZodOptional<z.ZodString>;
        keys: z.ZodDefault<z.ZodArray<z.ZodObject<{
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            at: z.ZodNumber;
        }, z.core.$strict>>>;
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
        scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
        id: z.ZodString;
        shape: z.ZodEnum<{
            box: "box";
            sphere: "sphere";
            torus: "torus";
            cylinder: "cylinder";
            plane: "plane";
            image: "image";
            model: "model";
        }>;
    }, z.core.$strict>>;
    ambient: z.ZodDefault<z.ZodNumber>;
    lights: z.ZodDefault<z.ZodArray<z.ZodObject<{
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        color: z.ZodDefault<z.ZodString>;
        intensity: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>>;
    copyPosition: z.ZodDefault<z.ZodEnum<{
        top: "top";
        bottom: "bottom";
        none: "none";
    }>>;
    copyAt: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type World = z.infer<typeof worldSchema>;
export type CameraKey = z.infer<typeof cameraKeySchema>;
export declare function cameraAt(time: number, camera: World['camera']): {
    position: Vec3;
    target: Vec3;
    fov: number;
    roll: number;
};
export declare function objectAt(time: number, object: World['objects'][number]): {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
};
