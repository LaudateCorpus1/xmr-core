import { HWDevice } from "../device";
export declare function derive_key_image_from_tx(tx_pub: string, view_sec: string, spend_pub: string, spend_sec: string, output_index: number, hwdev: HWDevice): Promise<{
    ephemeral_pub: string;
    key_image: string;
}>;
export declare function generate_key_image(pub: string, sec: string): string;
//# sourceMappingURL=key_image.d.ts.map