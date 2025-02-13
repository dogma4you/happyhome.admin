import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../Components/Button";
export default function Cms() {
  const location = useLocation();

  let page = location.pathname.split("/").pop();
  const [cmsValue, setCmsValue] = useState("");

  function renderCmsName() {
    switch (page) {
      case "faq":
        return "FAQ";
      case "whats-new":
        return "What's New";
      case "main-page":
        return "Main Page";
      case "top-section":
        return "Top Section";
      case "what-we-do-seller":
        return "What We Do - Seller";
      case "what-we-do-buyer":
        return "What We Do - Buyer";
      default:
        return "Cms";
    }
  }

  function saveCms(status) {
    if (status === "cancel") {
      setCmsValue("");
    }
  }

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <h2 className="font-medium text-2xl">{renderCmsName()}</h2>
      {/* <div className="flex gap-3 w-full">
        <Editor
          apiKey="be1np05ib02zxdqs1atlmv2xx6u5om3z0noo9y19yt1ruzgj"
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            directionality: "ltr",
            statusbar: false,
            branding: false,
            width: "100%",
          }}
          value={cmsValue}
          onEditorChange={(newValue) => {
            setCmsValue(newValue);
          }}
        />
        <div className="flex flex-col gap-3 w-full">
          <Button
            color="bg-primary"
            text="Approve"
            onClick={() => saveCms("approve")}
          />
          <Button
            color="bg-amber-700"
            text="Cancel"
            onClick={() => saveCms("cancel")}
          />
        </div>
      </div> */}
    </div>
  );
}
