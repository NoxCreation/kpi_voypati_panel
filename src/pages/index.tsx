import { GetServerSideProps } from "next";
import { syncDatabase } from "@/lib/dbSync";
import { Layout } from "@/components/layout";
import LoadSuspense from "@/components/LoadSuspense";
import Sync from "@/database/models/Sync";

export default function Home() {
  return (
    <Layout>
      <LoadSuspense
        load={() => import("@/modules/home")}
        params={{

        }}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await syncDatabase()
  const sync = await Sync.findOne()
  if(sync==null)
    await Sync.create({
      syncAt: new Date('2024-08-11 00:26:47.301-04')
    })

  /* const order_by_users = await OrderByUsers.findAll({})
  const data = JSON.parse(JSON.stringify(order_by_users)) as Array<{ orders: string }>

  const client_numbers = data.length
  const order_numbers = data.map(e => e.orders.length).reduce((p, c) => p + c, 0) */

  return {
    props: {
      /* data,
      client_numbers,
      order_numbers */
    }
  }
}
