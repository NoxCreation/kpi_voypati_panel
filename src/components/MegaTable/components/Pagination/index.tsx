import { Pagination } from "@ark-ui/react/pagination"
import { Button, Flex } from "@chakra-ui/react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export const PaginationMain = (props: {
  count: number
  page: number
  pageSize: number
  onPageSelect?: (page: number) => void
}) => {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(props.count / props.pageSize)

  const handlePrevPage = () => {
    if (props.page > 0 && props.onPageSelect) {
      props.onPageSelect(props.page - 1)
    }
  }

  const handleNextPage = () => {
    if (props.page < totalPages - 1 && props.onPageSelect) {
      props.onPageSelect(props.page + 1)
    }
  }

  // Verificar si los botones deben estar deshabilitados
  const isPrevDisabled = props.page === 0
  const isNextDisabled = props.page >= totalPages - 1

  return (
    <Pagination.Root siblingCount={2} style={{ display: "flex", gap: "5px" }} {...props}>
      <Pagination.PrevTrigger>
        <Button
          variant={"ghost"}
          fontSize={"12px"}
          size={"sm"}
          onClick={handlePrevPage}
          disabled={isPrevDisabled}
        >
          <FiChevronLeft />
        </Button>
      </Pagination.PrevTrigger>
      <Flex w={"100%"} justifyContent={"center"} alignItems={"center"} gap={1}>
        <Pagination.Context>
          {(pagination) =>
            pagination.pages.map((page, index) =>
              page.type === "page" ? (
                <Pagination.Item key={index} {...page}>
                  <Button
                    size={"xs"}
                    variant={page.value - 1 === props.page ? "solid" : "ghost"}
                    onClick={() => props.onPageSelect && props.onPageSelect(page.value - 1)}
                  >
                    {page.value}
                  </Button>
                </Pagination.Item>
              ) : (
                <Pagination.Ellipsis key={index} index={index}>
                  &#8230;
                </Pagination.Ellipsis>
              ),
            )
          }
        </Pagination.Context>
      </Flex>
      <Pagination.NextTrigger>
        <Button
          variant={"ghost"}
          fontSize={"12px"}
          size={"sm"}
          onClick={handleNextPage}
          disabled={isNextDisabled}
        >
          <FiChevronRight />
        </Button>
      </Pagination.NextTrigger>
    </Pagination.Root>
  )
}

