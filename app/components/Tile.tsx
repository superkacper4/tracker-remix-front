import { useState } from "react";
import { Modal } from "./Modal";
import { Form } from "@remix-run/react";
import { gql } from "graphql-request";

type Props = {
  listItems: unknown[];
  title: string;
  colorMain: string;
  colorTile: string;
  isExercise?: boolean;
};

export const Tile = ({
  listItems,
  title,
  colorMain,
  colorTile,
  isExercise,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<null | number>(null);

  return (
    <>
      <Modal
        title={`Add ${title}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Form className="flex flex-col" method="post">
          <input required type="text" name="title" placeholder="Title" />
          <input required type="number" name="kcal" placeholder="kcal" />
          {isExercise ? (
            <input required type="number" name="time" placeholder="time" />
          ) : null}
          {editedItem ? (
            <input type="hidden" name="id" value={editedItem} />
          ) : null}
          <button type="submit">Add</button>
        </Form>
      </Modal>
      <section
        className={`flex flex-col w-full max-w-[600px] items-center rounded p-4 ${colorMain}`}
      >
        <div className="flex justify-between w-full pb-2">
          <h2 className="text-2xl">{title}</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black p-2 rounded hover:bg-gray-200 transition-colors"
          >
            + ADD
          </button>
        </div>
        <section className="w-full max-w-[500px] flex-1">
          {listItems?.length ? (
            listItems?.map((item) => (
              <div
                key={item?.id}
                className={`${colorTile} rounded flex flex-wrap p-2 mb-2`}
              >
                <div className="flex justify-between w-full mb-2">
                  <h3 className="w-full  text-xl text-bold">{item?.title}</h3>
                  <Form className="flex gap-2" method="post">
                    <button
                      type="submit"
                      name={isExercise ? "deleteExercise" : "deleteMeal"}
                      value={item.id}
                      className="bg-white text-red-400 rounded p-1"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="bg-white text-yellow-600 rounded p-1"
                      onClick={() => {
                        setIsModalOpen(true);
                        setEditedItem(item.id);
                      }}
                    >
                      Edit
                    </button>
                  </Form>
                </div>
                <div className="flex w-full justify-between">
                  <p>{item?.kcal} kcal</p>
                  {item?.time ? <p>{item?.time} min</p> : null}
                </div>
              </div>
            ))
          ) : (
            <p>No meals yet</p>
          )}
        </section>
      </section>
    </>
  );
};
