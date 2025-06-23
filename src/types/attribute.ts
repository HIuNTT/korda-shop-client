export interface AttributeGroup {
  id: number
  name: string
  order_no: number
  is_filter: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
  attributes: Attribute[]
}

export interface Attribute {
  id: number
  name: string
  key: string
  order_no: number
  is_selected: boolean
  is_display: boolean
  is_key_selling: boolean
  is_filter: boolean
  is_required: boolean
  input_type: number
  description?: string
  options?: AttributeValueOption[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface AttributeValueOption {
  id: number
  name: string
  description?: string
  order_no: number
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface DefaultAttribute {
  name: string
  value: string
}

export interface AttributeValue extends Pick<Attribute, "id" | "name"> {
  value: string
}

export interface AttributeItem {
  group_name: string
  attributes: AttributeValue[]
}
