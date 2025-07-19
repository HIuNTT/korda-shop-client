import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField } from "@/components/ui/form"

const formSchema = z.object({
  keyword: z.string(),
})

export default function Search() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    console.log(data)
  }

  return (
    <div className="w-full max-w-[420px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormControl>
                <Input
                  size="lg"
                  placeholder="Tìm kiếm sản phẩm"
                  startContent={<SearchIcon className="text-muted-foreground" />}
                  {...field}
                />
              </FormControl>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
