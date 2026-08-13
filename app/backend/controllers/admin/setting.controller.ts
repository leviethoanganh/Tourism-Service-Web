import { Response } from "express";
import bcrypt from "bcryptjs";
import moment from "moment";
import Role from "../../models/role.model";
import AccountAdmin from "../../models/account-admin.model";
import SettingWebsiteInfo from "../../models/setting-website-info.model";
import { permissionList } from "../../configs/variable.config";
import { AuthRequest } from "../../interfaces";

export const websiteInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const info = await SettingWebsiteInfo.findOne({});
    res.json({ code: "success", settingWebsiteInfo: info });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const websiteInfoPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    delete req.body.logo;
    delete req.body.favicon;

    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      if (files.logo?.[0]) {
        const f = files.logo[0];
        req.body.logo = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
      }
      if (files.favicon?.[0]) {
        const f = files.favicon[0];
        req.body.favicon = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
      }
    }

    const existRecord = await SettingWebsiteInfo.findOne({});
    if (!existRecord) {
      req.body.createdBy = req.account!.id;
      const newRecord = new SettingWebsiteInfo(req.body);
      await newRecord.save();
    } else {
      req.body.updatedBy = req.account!.id;
      await SettingWebsiteInfo.updateOne({}, req.body);
    }

    res.json({ code: "success", message: "Website information updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred, please try again later!" });
  }
};

export const accountAdminList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accounts = await AccountAdmin.find({ deleted: false }).sort({ createdAt: "desc" });
    const enriched = await Promise.all(
      accounts.map(async (item) => {
        const obj = item.toObject() as any;
        if (obj.role) {
          const role = await Role.findOne({ _id: obj.role, deleted: false });
          if (role) obj.roleName = role.name;
        }
        return obj;
      })
    );
    res.json({ code: "success", accountAdminList: enriched });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const accountAdminCreatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existEmail = await AccountAdmin.findOne({ email: req.body.email });
    if (existEmail) {
      res.json({ code: "error", message: "Email already exists in the system!" });
      return;
    }

    if (req.file) {
      req.body.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else {
      req.body.avatar = "";
    }

    req.body.createdBy = req.account!.id;
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    res.json({ code: "success", message: "Admin account created successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to create admin account!" });
  }
};

export const accountAdminEditPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const accountDetail = await AccountAdmin.findOne({ _id: id, deleted: false });
    if (!accountDetail) {
      res.json({ code: "error", message: "Account not found!" });
      return;
    }

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });
    if (existEmail) {
      res.json({ code: "error", message: "Email already exists in the system!" });
      return;
    }

    if (req.file) {
      req.body.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete req.body.password;
    }

    req.body.updatedBy = req.account!.id;
    await AccountAdmin.updateOne({ _id: id, deleted: false }, req.body);

    res.json({ code: "success", message: "Admin account updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Update failed!" });
  }
};

export const roleList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roles = await Role.find({ deleted: false }).sort({ createdAt: "desc" });
    const enriched = await Promise.all(
      roles.map(async (item) => {
        const obj = item.toObject() as any;
        if (obj.createdBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.createdBy });
          if (acc) obj.createdByFullName = acc.fullName;
        }
        if (obj.updatedBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.updatedBy });
          if (acc) obj.updatedByFullName = acc.fullName;
        }
        obj.createdAtFormat = moment(obj.createdAt).format("HH:mm - DD/MM/YYYY");
        obj.updatedAtFormat = moment(obj.updatedAt).format("HH:mm - DD/MM/YYYY");
        return obj;
      })
    );
    res.json({ code: "success", roleList: enriched, permissionList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const roleCreatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.createdBy = req.account!.id;
    const newRecord = new Role(req.body);
    await newRecord.save();
    res.json({ code: "success", message: "Role created successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to create role!" });
  }
};

export const roleGetDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roleDetail = await Role.findOne({ _id: req.params.id, deleted: false });
    if (!roleDetail) {
      res.status(404).json({ code: "error", message: "Role not found!" });
      return;
    }
    res.json({ code: "success", roleDetail, permissionList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const roleEditPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roleDetail = await Role.findOne({ _id: req.params.id, deleted: false });
    if (!roleDetail) {
      res.json({ code: "error", message: "Invalid data!" });
      return;
    }
    req.body.updatedBy = req.account!.id;
    await Role.updateOne({ _id: req.params.id, deleted: false }, req.body);
    res.json({ code: "success", message: "Updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Update failed!" });
  }
};
