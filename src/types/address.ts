import { AddressType } from "@/constants/addressType"

export interface Address {
  id: number
  name: string
  phone: string
  province_id: number
  district_id: number
  ward_id: number
  address: string
  full_address: string
  type: AddressType
  is_default: boolean
}
