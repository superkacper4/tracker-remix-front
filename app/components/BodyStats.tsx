import { Form } from "@remix-run/react";
import { useState } from "react";

type Props = {
  bodyStats: unknown;
};

export const BodyStats = ({ bodyStats }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <section className="flex flex-col w-full max-w-[600px] items-center rounded p-4 bg-sky-300">
      <div className=" flex justify-between w-full mb-2">
        <h2 className="text-2xl">Body stats</h2>
        <Form className="flex gap-2" method="post">
          <button
            type="submit"
            className="bg-white text-red-400 rounded p-1"
            name="resetBodyStats"
            value={"true"}
          >
            Reset
          </button>
          <button
            type="button"
            className="bg-white text-yellow-600 rounded p-1"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </button>
        </Form>
      </div>

      <section className="w-full max-w-[500px] flex-1">
        <Form className="bg-sky-200 rounded flex flex-wrap p-2" method="post">
          <h3 className="w-full text-center text-xl text-bold">
            BMI: {Math.round(bodyStats?.bmi ?? 0)}
          </h3>

          <div className="flex w-full justify-between">
            {isEditMode ? (
              <>
                <input className="w-[100px]" type="number" name="weight" />
                <p>kg</p>
              </>
            ) : (
              <p>{bodyStats?.weight} kg</p>
            )}
            {isEditMode ? (
              <>
                <input className="w-[100px]" type="number" name="height" />
                <p>cm</p>
              </>
            ) : (
              <p>{bodyStats?.height} cm</p>
            )}
          </div>
          {isEditMode ? (
            <button
              type="submit"
              onClick={() => {
                setTimeout(() => {
                  setIsEditMode(false);
                }, 500);
              }}
            >
              Save
            </button>
          ) : null}
        </Form>
      </section>
    </section>
  );
};
