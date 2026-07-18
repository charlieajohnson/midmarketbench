import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/case/DataTable";
import type { CaseFile } from "@/lib/types";

export function CaseFileList({ files }: { files: CaseFile[] }) {
  return (
    <div>
      {files.map((file) => (
        <article className="file-block" key={file.filename}>
          <div className="file-head">
            <div>
              <h3 style={{ margin: 0, fontSize: ".9rem" }} className="mono">
                {file.filename}
              </h3>
              <p className="fine" style={{ margin: "4px 0 0" }}>
                {file.description}
              </p>
            </div>
            <Badge>{file.type}</Badge>
          </div>
          {file.content && <pre className="case-file-content">{file.content}</pre>}
          {file.table && <DataTable table={file.table} label={file.description} />}
        </article>
      ))}
    </div>
  );
}
