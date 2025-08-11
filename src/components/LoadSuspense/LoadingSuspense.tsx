import { Flex } from '@chakra-ui/react'
import styles from './LoadingSuspense.module.css'

export const LoadingSuspense = ({
    isFull
}: {
    isFull?: boolean
}) => {
    return (
        <>
            {true && (
                <Flex
                    w={'100%'}
                    h={isFull ? '100vh' : '90vh'}
                    backdropFilter="blur(10px)"
                    zIndex={999}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <div className={styles.loader}></div>
                </Flex>
            )}
        </>
    )
}