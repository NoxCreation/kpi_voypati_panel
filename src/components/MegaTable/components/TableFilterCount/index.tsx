import { Flex } from "@chakra-ui/react";
import React from "react";

/* type Props = {
  count?: number
  isLoading?: boolean
  onChangeFilterCount?: (e: number) => void;
}; */

export default function TableFilterCount(/* { count, isLoading, onChangeFilterCount }: Props */) {
  return (
    <Flex
      justifyContent={"end"}
      position={"relative"}
    >
      {/* <Select
        value={count}
        defaultValue={10}
        width={"fit-content"}
        colorScheme="cyan"
        position={"sticky"}
        isDisabled={isLoading}
        onChange={(e) =>
          onChangeFilterCount && onChangeFilterCount(parseInt(e.target.value))
        }
        size={'sm'}
        fontSize={'xs'}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <option key={index}>{(index + 1) * 5}</option>
        ))}
      </Select> */}
    </Flex>
  );
}
