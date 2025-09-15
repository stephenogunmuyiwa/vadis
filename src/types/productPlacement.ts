export interface ProductPlacementItem {
imageurl: string;
brand_name: string;
category: string;
item_name: string;
id: string;
date_added: number;
is_visble: boolean;
}


export interface ProductPlacementResponse {
ok: boolean;
cached?: boolean;
user_email: string;
project_id: string;
scene_id: string;
shot_id: string;
count: number;
products: ProductPlacementItem[];
error?: string;
}