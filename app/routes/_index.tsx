import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { gql } from "graphql-request";
import { client } from "../graphql-client";
import { useLoaderData } from "@remix-run/react";

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

export const loader: LoaderFunction = async () => {
  const data = await client.request(GetAllData);
  return json(data);
};

export default function Index() {
  const data = useLoaderData();

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
      <section className="flex flex-col w-full max-w-[600px] items-center rounded p-4 bg-orange-300">
        <h2 className="text-2xl">Exercises</h2>
        <section className="w-full max-w-[500px] flex-1">
          {data?.exercises?.length ? (
            data?.exercises?.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-orange-200 rounded flex flex-wrap p-2"
              >
                <h3 className="w-full text-center text-xl text-bold">
                  {exercise.title}
                </h3>
                <div className="flex w-full justify-between">
                  <p>{exercise.kcal} kcal</p>
                  <p>{exercise.time} min</p>
                </div>
              </div>
            ))
          ) : (
            <p>No meals yet</p>
          )}
        </section>
      </section>
      <section className="flex flex-col w-full max-w-[600px] items-center rounded p-4 bg-green-300">
        <h2 className="text-2xl">Meals</h2>
        <section className="w-full max-w-[500px] flex-1">
          {data?.meals?.length ? (
            data?.meals?.map((meal) => (
              <div
                key={meal.id}
                className="bg-green-200 rounded flex flex-wrap p-2"
              >
                <h3 className="w-full text-center text-xl text-bold">
                  {meal.title}
                </h3>
                <div className="flex w-full justify-between">
                  <p>{meal.kcal} kcal</p>
                </div>
              </div>
            ))
          ) : (
            <p>No meals yet</p>
          )}
        </section>
      </section>
    </main>
  );
}
