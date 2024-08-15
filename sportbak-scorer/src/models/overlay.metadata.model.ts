export interface OverlayMetadataObjectOrigin {
    x : number; // 0 to 1
    y : number; // 0 to 1
}
export interface OverlayMetadataObjectOrigins {
    external : OverlayMetadataObjectOrigin;
    internal : OverlayMetadataObjectOrigin;
}

export interface OverlayMetadataObjectPosition {
    x : number; 
    y : number;
}

export interface OverlayMetadataObjectPosition {
    x : number; 
    y : number;
}

export interface OverlayMetadataObjectSize {
    keep_image_ratio? : boolean;     
    ratio_width_on_height? : number;   
    width_percentage : boolean;
    height_percentage : boolean;
    width : number | null; // can be null if keep_ratio is true & height is defined
    height : number | null; // can be null if keep_ratio is true & width is defined
}

export interface OverlayMetadataObject {
    id? : string;
    image? : string; // path of image
    text? : string;  // value of text
    font? : string;
    font_size? : number;
    font_color? : string;
    background_color? : string;
    stroke_color? : string;
    line_width? : number;
    origin : OverlayMetadataObjectOrigins;
    position : OverlayMetadataObjectPosition;
    size : OverlayMetadataObjectSize;
    children? : OverlayMetadataObject[];
    visible : boolean; // even if visible is false - child can be is visible. Else put enable to false 
    enabled : boolean;
}

export default interface OverlayMetadata {
    redraw : boolean;
    width : number;
    height : number;
    objects : OverlayMetadataObject[];
}