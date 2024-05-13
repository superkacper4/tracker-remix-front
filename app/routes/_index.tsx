import {
  ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { gql } from "graphql-request";
import { client } from "../graphql-client";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/Modal";
import { Tile } from "~/components/Tile";
import { graphql } from "graphql/graphql";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const GetAllData = gql`
  query Query {
    exercises {
      id
      kcal
      time
      title
    }
    meals {
      id
      kcal
      title
    }
    bodyStats {
      bmi
      height
      weight
    }
  }
`;

const SendExercise = gql`
  mutation AddExercise($kcal: Int, $time: Int, $title: String) {
    addExercise(kcal: $kcal, time: $time, title: $title) {
      id
      kcal
      time
      title
    }
  }
`;

const SendMeal = gql`
  mutation AddMeal($title: String, $kcal: Int) {
    addMeal(title: $title, kcal: $kcal) {
      id
      kcal
      title
    }
  }
`;

export const loader: LoaderFunction = async () => {
  const data = await client.request(GetAllData);
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const kcal = formData.get("kcal");
  const time = formData.get("time");

  console.log({ title, kcal, time }, request);

  if (time) {
    const res = await client.request(SendExercise, {
      title,
      kcal: Number(kcal),
      time: Number(time),
    });
    return json(res);
  }

  const res = await client.request(SendMeal, {
    title,
    kcal: Number(kcal),
  });

  return json(res);
};

export default function Index() {
  const data = useLoaderData();
  const actionData = useActionData();

  console.log({ actionData });

  return (
    <main className="w-full min-h-screen bg-gray-100 flex flex-col items-center gap-4 p-4">
      <h1 className="text-bold text-3xl">Remix.run frontend - Master thesis</h1>
      <section className="flex flex-col w-full max-w-[600px] items-center rounded p-4 bg-sky-300">
        <h2 className="text-2xl">Body stats</h2>
        <section className="w-full max-w-[500px] flex-1">
          <div className="bg-sky-200 rounded flex flex-wrap p-2">
            <h3 className="w-full text-center text-xl text-bold">
              BMI: {data?.bodyStats?.bmi}
            </h3>
            <div className="flex w-full justify-between">
              <p>{data?.bodyStats?.weight} kg</p>
              <p>{data?.bodyStats?.height} cm</p>
            </div>
          </div>
        </section>
      </section>
      <Tile
        colorMain="bg-orange-300"
        colorTile="bg-orange-200"
        title="Exercises"
        listItems={data?.exercises}
        isExercise
      />
      <Tile
        colorMain="bg-green-300"
        colorTile="bg-green-200"
        title="Meals"
        listItems={data?.meals}
      />
    </main>
  );
}
