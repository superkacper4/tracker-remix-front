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
import { BodyStats } from "~/components/BodyStats";

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

const DeleteExercise = gql`
  mutation DeleteExercise($id: Int) {
    deleteExercise(id: $id) {
      id
    }
  }
`;

const DeleteMeal = gql`
  mutation DeleteMeal($id: Int) {
    deleteMeal(id: $id) {
      id
    }
  }
`;

const EditExercise = gql`
  mutation EditExercise(
    $editExerciseId: Int
    $title: String
    $time: Int
    $kcal: Int
  ) {
    editExercise(id: $editExerciseId, title: $title, time: $time, kcal: $kcal) {
      id
    }
  }
`;

const EditMeal = gql`
  mutation EditMeal($editMealId: Int, $title: String, $kcal: Int) {
    editMeal(id: $editMealId, title: $title, kcal: $kcal) {
      id
    }
  }
`;

const EditBodyStats = gql`
  mutation AddBodyStats($weight: Int, $height: Int) {
    addBodyStats(weight: $weight, height: $height) {
      bmi
    }
  }
`;

const ResetBoyStats = gql`
  mutation ResetBodyStats {
    resetBodyStats {
      bmi
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
  const editId = formData.get("id");

  const exerciseDeleteId = formData.get("deleteExercise");
  const mealDeleteId = formData.get("deleteMeal");

  const height = formData.get("height");
  const weight = formData.get("weight");

  const resetBodyStats = formData.get("resetBodyStats");

  if (resetBodyStats) {
    const res = await client.request(ResetBoyStats);

    return json(res);
  }

  if (height && weight) {
    const res = await client.request(EditBodyStats, {
      weight: Number(weight),
      height: Number(height),
    });

    return json(res);
  }

  if (exerciseDeleteId) {
    const res = await client.request(DeleteExercise, {
      id: Number(exerciseDeleteId),
    });

    return json(res);
  }

  if (mealDeleteId) {
    const res = await client.request(DeleteMeal, {
      id: Number(mealDeleteId),
    });

    return json(res);
  }

  if (time) {
    if (editId) {
      const res = await client.request(EditExercise, {
        editExerciseId: Number(editId),
        title,
        kcal: Number(kcal),
        time: Number(time),
      });
      return json(res);
    }
    const res = await client.request(SendExercise, {
      title,
      kcal: Number(kcal),
      time: Number(time),
    });
    return json(res);
  }

  if (editId) {
    const res = await client.request(EditMeal, {
      editMealId: Number(editId),
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

  return (
    <main className="w-full min-h-screen bg-gray-100 flex flex-col items-center gap-4 p-4">
      <h1 className="text-bold text-3xl">Remix.run frontend - Master thesis</h1>
      <BodyStats bodyStats={data?.bodyStats} />
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
